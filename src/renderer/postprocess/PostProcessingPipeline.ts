/**
 * Post-Processing Pipeline - Multi-pass GPU effects for fractal rendering
 *
 * Architecture:
 *   Fractal Pass → Intermediate Texture
 *   [If bloom] → Bloom Extract → Blur H → Blur V
 *   Composite Pass (bloom + vignette + sharpen + chromatic aberration + tone mapping) → Canvas
 *
 * "A multi-pass rendering pipeline? Embarrassingly simple for an entity of my capabilities."
 * - Skippy the Magnificent
 */

import {
  PostProcessSettings,
  PostProcessPreset,
  DEFAULT_POST_PROCESS_SETTINGS,
  applyPreset,
} from './PostProcessState';

import bloomExtractSource from '../shaders/bloom-extract.wgsl?raw';
import blurSource from '../shaders/blur.wgsl?raw';
import compositeSource from '../shaders/composite.wgsl?raw';
import blitSource from '../shaders/blit.wgsl?raw';

// Matches PostProcessUniforms in composite.wgsl (padded to 16-byte alignment)
const POST_PROCESS_UNIFORM_SIZE = 128;
// 4 f32 values × 4 bytes = 16 bytes (matches BlurUniforms in WGSL)
const BLUR_UNIFORM_SIZE = 16;

export class PostProcessingPipeline {
  private device: GPUDevice;
  private format: GPUTextureFormat;

  settings: PostProcessSettings;

  // Textures
  private intermediateTexture: GPUTexture | null = null;
  private bloomExtractTexture: GPUTexture | null = null;
  private bloomBlurTempTexture: GPUTexture | null = null;
  private bloomBlurTexture: GPUTexture | null = null;

  // Feedback trail textures (ping-pong pair)
  private feedbackTextureA: GPUTexture | null = null;
  private feedbackTextureB: GPUTexture | null = null;
  private feedbackIndex = 0; // 0: write to A (read B as history), 1: write to B (read A)

  private sampler: GPUSampler;

  // Pipelines
  private bloomExtractPipeline: GPURenderPipeline;
  private blurPipeline: GPURenderPipeline;
  private compositePipeline: GPURenderPipeline;
  private blitPipeline: GPURenderPipeline;

  // Bind group layouts
  private singleTextureLayout: GPUBindGroupLayout;
  private compositeLayout: GPUBindGroupLayout;
  private blitLayout: GPUBindGroupLayout;

  // Bind groups (recreated on resize)
  private bloomExtractBindGroup: GPUBindGroup | null = null;
  private blurHBindGroup: GPUBindGroup | null = null;
  private blurVBindGroup: GPUBindGroup | null = null;
  private compositeBindGroup: GPUBindGroup | null = null;
  // Feedback: two composite bind groups (one per ping-pong state) + two blit bind groups
  private compositeBindGroupFB: [GPUBindGroup | null, GPUBindGroup | null] = [null, null];
  private blitBindGroupFB: [GPUBindGroup | null, GPUBindGroup | null] = [null, null];

  // Uniform buffers
  private uniformBuffer: GPUBuffer;
  private blurHUniformBuffer: GPUBuffer;
  private blurVUniformBuffer: GPUBuffer;

  private width = 0;
  private height = 0;

  // Feedback snapshot timing
  private lastSnapshotTime = 0;

  constructor(device: GPUDevice, format: GPUTextureFormat) {
    this.device = device;
    this.format = format;
    this.settings = { ...DEFAULT_POST_PROCESS_SETTINGS };

    this.sampler = device.createSampler({
      label: 'Post-Process Sampler',
      magFilter: 'linear',
      minFilter: 'linear',
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
    });

    this.uniformBuffer = device.createBuffer({
      label: 'Post-Process Uniforms',
      size: POST_PROCESS_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.blurHUniformBuffer = device.createBuffer({
      label: 'Blur H Uniforms',
      size: BLUR_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.blurVUniformBuffer = device.createBuffer({
      label: 'Blur V Uniforms',
      size: BLUR_UNIFORM_SIZE,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // --- Bind group layouts ---

    // Used by bloom extract and blur passes: sampler + texture + uniforms
    this.singleTextureLayout = device.createBindGroupLayout({
      label: 'Single Texture Layout',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: 'uniform' },
        },
      ],
    });

    // Used by composite pass: sampler + fractal + bloom + uniforms + history (feedback)
    this.compositeLayout = device.createBindGroupLayout({
      label: 'Composite Layout',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
        {
          binding: 3,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: 'uniform' },
        },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      ],
    });

    // Used by blit pass: sampler + texture only
    this.blitLayout = device.createBindGroupLayout({
      label: 'Blit Layout',
      entries: [
        { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
      ],
    });

    // --- Shader modules ---

    const bloomExtractModule = device.createShaderModule({
      label: 'Bloom Extract Shader',
      code: bloomExtractSource,
    });

    const blurModule = device.createShaderModule({
      label: 'Blur Shader',
      code: blurSource,
    });

    const compositeModule = device.createShaderModule({
      label: 'Composite Shader',
      code: compositeSource,
    });

    const blitModule = device.createShaderModule({
      label: 'Blit Shader',
      code: blitSource,
    });

    // --- Render pipelines ---

    this.bloomExtractPipeline = device.createRenderPipeline({
      label: 'Bloom Extract Pipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [this.singleTextureLayout] }),
      vertex: { module: bloomExtractModule, entryPoint: 'vertexMain' },
      fragment: {
        module: bloomExtractModule,
        entryPoint: 'fragmentMain',
        targets: [{ format }],
      },
      primitive: { topology: 'triangle-list' },
    });

    this.blurPipeline = device.createRenderPipeline({
      label: 'Blur Pipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [this.singleTextureLayout] }),
      vertex: { module: blurModule, entryPoint: 'vertexMain' },
      fragment: {
        module: blurModule,
        entryPoint: 'fragmentMain',
        targets: [{ format }],
      },
      primitive: { topology: 'triangle-list' },
    });

    this.compositePipeline = device.createRenderPipeline({
      label: 'Composite Pipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [this.compositeLayout] }),
      vertex: { module: compositeModule, entryPoint: 'vertexMain' },
      fragment: {
        module: compositeModule,
        entryPoint: 'fragmentMain',
        targets: [{ format }],
      },
      primitive: { topology: 'triangle-list' },
    });

    this.blitPipeline = device.createRenderPipeline({
      label: 'Blit Pipeline',
      layout: device.createPipelineLayout({ bindGroupLayouts: [this.blitLayout] }),
      vertex: { module: blitModule, entryPoint: 'vertexMain' },
      fragment: {
        module: blitModule,
        entryPoint: 'fragmentMain',
        targets: [{ format }],
      },
      primitive: { topology: 'triangle-list' },
    });

    console.log('Post-processing pipeline initialized');
  }

  isEnabled(): boolean {
    return this.settings.enabled;
  }

  setPreset(preset: PostProcessPreset): void {
    this.settings = applyPreset(preset);
  }

  /**
   * Resize intermediate textures to match canvas dimensions.
   * Must be called whenever the canvas resizes.
   */
  resize(width: number, height: number): void {
    if (width === this.width && height === this.height) return;

    this.width = width;
    this.height = height;

    // Destroy old textures
    this.intermediateTexture?.destroy();
    this.bloomExtractTexture?.destroy();
    this.bloomBlurTempTexture?.destroy();
    this.bloomBlurTexture?.destroy();
    this.feedbackTextureA?.destroy();
    this.feedbackTextureB?.destroy();

    const halfWidth = Math.max(1, Math.floor(width / 2));
    const halfHeight = Math.max(1, Math.floor(height / 2));

    // Intermediate: full-res fractal render target
    this.intermediateTexture = this.device.createTexture({
      label: 'Post-Process Intermediate',
      size: { width, height },
      format: this.format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    // Bloom textures: half-res for wider blur spread and better performance
    this.bloomExtractTexture = this.device.createTexture({
      label: 'Bloom Extract',
      size: { width: halfWidth, height: halfHeight },
      format: this.format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    this.bloomBlurTempTexture = this.device.createTexture({
      label: 'Bloom Blur Temp',
      size: { width: halfWidth, height: halfHeight },
      format: this.format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    this.bloomBlurTexture = this.device.createTexture({
      label: 'Bloom Blur',
      size: { width: halfWidth, height: halfHeight },
      format: this.format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    // Feedback trail textures: full-res ping-pong pair
    this.feedbackTextureA = this.device.createTexture({
      label: 'Feedback A',
      size: { width, height },
      format: this.format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    this.feedbackTextureB = this.device.createTexture({
      label: 'Feedback B',
      size: { width, height },
      format: this.format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    this.feedbackIndex = 0;

    this.createBindGroups(halfWidth, halfHeight);
  }

  /**
   * Get a view of the intermediate texture for the fractal pass to render into.
   */
  getIntermediateTextureView(): GPUTextureView {
    return this.intermediateTexture!.createView();
  }

  /**
   * Encode all post-processing render passes into the command encoder.
   * The final composite pass renders to canvasTextureView.
   */
  encodePostProcessPasses(
    commandEncoder: GPUCommandEncoder,
    canvasTextureView: GPUTextureView
  ): void {
    this.updateUniforms();

    // Bloom passes (only if bloom is enabled)
    if (this.settings.bloomEnabled) {
      // 1. Extract bright pixels (full-res input → half-res output)
      const extractPass = commandEncoder.beginRenderPass({
        label: 'Bloom Extract',
        colorAttachments: [
          {
            view: this.bloomExtractTexture!.createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
      });
      extractPass.setPipeline(this.bloomExtractPipeline);
      extractPass.setBindGroup(0, this.bloomExtractBindGroup!);
      extractPass.draw(3);
      extractPass.end();

      // 2. Horizontal blur (half-res → half-res)
      const blurHPass = commandEncoder.beginRenderPass({
        label: 'Blur Horizontal',
        colorAttachments: [
          {
            view: this.bloomBlurTempTexture!.createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
      });
      blurHPass.setPipeline(this.blurPipeline);
      blurHPass.setBindGroup(0, this.blurHBindGroup!);
      blurHPass.draw(3);
      blurHPass.end();

      // 3. Vertical blur (half-res → half-res)
      const blurVPass = commandEncoder.beginRenderPass({
        label: 'Blur Vertical',
        colorAttachments: [
          {
            view: this.bloomBlurTexture!.createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
      });
      blurVPass.setPipeline(this.blurPipeline);
      blurVPass.setBindGroup(0, this.blurVBindGroup!);
      blurVPass.draw(3);
      blurVPass.end();
    }

    if (this.settings.feedbackEnabled) {
      const now = performance.now();
      const interval = this.settings.feedbackInterval;
      const isSnapshotFrame = interval <= 0 || now - this.lastSnapshotTime >= interval;
      const currentFB = this.feedbackIndex;

      if (isSnapshotFrame) {
        // SNAPSHOT FRAME: composite → feedback texture (updates history), then blit → canvas
        this.lastSnapshotTime = now;
        const feedbackTarget =
          currentFB === 0
            ? this.feedbackTextureA!.createView()
            : this.feedbackTextureB!.createView();

        const compositePass = commandEncoder.beginRenderPass({
          label: 'Composite (→ Feedback)',
          colorAttachments: [
            {
              view: feedbackTarget,
              clearValue: { r: 0, g: 0, b: 0, a: 1 },
              loadOp: 'clear',
              storeOp: 'store',
            },
          ],
        });
        compositePass.setPipeline(this.compositePipeline);
        compositePass.setBindGroup(0, this.compositeBindGroupFB[currentFB]!);
        compositePass.draw(3);
        compositePass.end();

        // Blit updated feedback texture to canvas
        const blitPass = commandEncoder.beginRenderPass({
          label: 'Blit (Feedback → Canvas)',
          colorAttachments: [
            {
              view: canvasTextureView,
              clearValue: { r: 0, g: 0, b: 0, a: 1 },
              loadOp: 'clear',
              storeOp: 'store',
            },
          ],
        });
        blitPass.setPipeline(this.blitPipeline);
        blitPass.setBindGroup(0, this.blitBindGroupFB[currentFB]!);
        blitPass.draw(3);
        blitPass.end();

        // Swap ping-pong index for next frame
        this.feedbackIndex = 1 - currentFB;
      } else {
        // BETWEEN SNAPSHOTS: composite → canvas directly, blending with frozen history
        const compositePass = commandEncoder.beginRenderPass({
          label: 'Composite (with frozen history)',
          colorAttachments: [
            {
              view: canvasTextureView,
              clearValue: { r: 0, g: 0, b: 0, a: 1 },
              loadOp: 'clear',
              storeOp: 'store',
            },
          ],
        });
        compositePass.setPipeline(this.compositePipeline);
        compositePass.setBindGroup(0, this.compositeBindGroupFB[currentFB]!);
        compositePass.draw(3);
        compositePass.end();
      }
    } else {
      // NORMAL MODE: composite directly to canvas
      const compositePass = commandEncoder.beginRenderPass({
        label: 'Composite',
        colorAttachments: [
          {
            view: canvasTextureView,
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
      });
      compositePass.setPipeline(this.compositePipeline);
      compositePass.setBindGroup(0, this.compositeBindGroup!);
      compositePass.draw(3);
      compositePass.end();
    }
  }

  private createBindGroups(halfWidth: number, halfHeight: number): void {
    const intermediateView = this.intermediateTexture!.createView();
    const bloomExtractView = this.bloomExtractTexture!.createView();
    const bloomBlurTempView = this.bloomBlurTempTexture!.createView();
    const bloomBlurView = this.bloomBlurTexture!.createView();

    // Bloom extract: reads full-res fractal intermediate
    this.bloomExtractBindGroup = this.device.createBindGroup({
      label: 'Bloom Extract Bind Group',
      layout: this.singleTextureLayout,
      entries: [
        { binding: 0, resource: this.sampler },
        { binding: 1, resource: intermediateView },
        { binding: 2, resource: { buffer: this.uniformBuffer } },
      ],
    });

    // Blur H: reads half-res bloom extract → writes to blur temp
    this.blurHBindGroup = this.device.createBindGroup({
      label: 'Blur H Bind Group',
      layout: this.singleTextureLayout,
      entries: [
        { binding: 0, resource: this.sampler },
        { binding: 1, resource: bloomExtractView },
        { binding: 2, resource: { buffer: this.blurHUniformBuffer } },
      ],
    });

    // Blur V: reads blur temp → writes to final bloom
    this.blurVBindGroup = this.device.createBindGroup({
      label: 'Blur V Bind Group',
      layout: this.singleTextureLayout,
      entries: [
        { binding: 0, resource: this.sampler },
        { binding: 1, resource: bloomBlurTempView },
        { binding: 2, resource: { buffer: this.blurVUniformBuffer } },
      ],
    });

    const feedbackViewA = this.feedbackTextureA!.createView();
    const feedbackViewB = this.feedbackTextureB!.createView();

    // Composite: reads fractal + bloom + history → writes to canvas or feedback texture
    // Default bind group (uses feedbackA as history — doesn't matter when feedback disabled)
    this.compositeBindGroup = this.device.createBindGroup({
      label: 'Composite Bind Group',
      layout: this.compositeLayout,
      entries: [
        { binding: 0, resource: this.sampler },
        { binding: 1, resource: intermediateView },
        { binding: 2, resource: bloomBlurView },
        { binding: 3, resource: { buffer: this.uniformBuffer } },
        { binding: 4, resource: feedbackViewA },
      ],
    });

    // Feedback ping-pong bind groups:
    // [0] writes to A, reads history from B
    this.compositeBindGroupFB[0] = this.device.createBindGroup({
      label: 'Composite Bind Group (FB→A)',
      layout: this.compositeLayout,
      entries: [
        { binding: 0, resource: this.sampler },
        { binding: 1, resource: intermediateView },
        { binding: 2, resource: bloomBlurView },
        { binding: 3, resource: { buffer: this.uniformBuffer } },
        { binding: 4, resource: feedbackViewB },
      ],
    });
    // [1] writes to B, reads history from A
    this.compositeBindGroupFB[1] = this.device.createBindGroup({
      label: 'Composite Bind Group (FB→B)',
      layout: this.compositeLayout,
      entries: [
        { binding: 0, resource: this.sampler },
        { binding: 1, resource: intermediateView },
        { binding: 2, resource: bloomBlurView },
        { binding: 3, resource: { buffer: this.uniformBuffer } },
        { binding: 4, resource: feedbackViewA },
      ],
    });

    // Blit bind groups: sample from feedback texture → canvas
    this.blitBindGroupFB[0] = this.device.createBindGroup({
      label: 'Blit Bind Group (A)',
      layout: this.blitLayout,
      entries: [
        { binding: 0, resource: this.sampler },
        { binding: 1, resource: feedbackViewA },
      ],
    });
    this.blitBindGroupFB[1] = this.device.createBindGroup({
      label: 'Blit Bind Group (B)',
      layout: this.blitLayout,
      entries: [
        { binding: 0, resource: this.sampler },
        { binding: 1, resource: feedbackViewB },
      ],
    });

    // Write blur direction uniforms (constant until next resize)
    const blurHData = new Float32Array([1.0 / halfWidth, 1.0 / halfHeight, 1.0, 0.0]);
    this.device.queue.writeBuffer(this.blurHUniformBuffer, 0, blurHData);

    const blurVData = new Float32Array([1.0 / halfWidth, 1.0 / halfHeight, 0.0, 1.0]);
    this.device.queue.writeBuffer(this.blurVUniformBuffer, 0, blurVData);
  }

  private updateUniforms(): void {
    const data = new ArrayBuffer(POST_PROCESS_UNIFORM_SIZE);
    const floats = new Float32Array(data);
    const ints = new Int32Array(data);

    floats[0] = this.width; // resolution.x
    floats[1] = this.height; // resolution.y
    floats[2] = 1.0 / this.width; // texelSize.x
    floats[3] = 1.0 / this.height; // texelSize.y
    floats[4] = this.settings.bloomThreshold;
    floats[5] = this.settings.bloomIntensity;
    floats[6] = this.settings.vignetteIntensity;
    floats[7] = this.settings.vignetteSoftness;
    floats[8] = this.settings.sharpenStrength;
    floats[9] = this.settings.chromaticAberrationIntensity;
    floats[10] = this.settings.exposure;
    floats[11] = this.settings.saturation;
    floats[12] = this.settings.temperature;
    ints[13] = this.settings.bloomEnabled ? 1 : 0;
    ints[14] = this.settings.vignetteEnabled ? 1 : 0;
    ints[15] = this.settings.sharpenEnabled ? 1 : 0;
    ints[16] = this.settings.chromaticAberrationEnabled ? 1 : 0;
    ints[17] = this.settings.toneMappingEnabled ? 1 : 0;
    // Ghost Mirrors
    ints[18] = this.settings.ghostMirrorEnabled ? 1 : 0;
    floats[19] = this.settings.ghostMirrorOpacity;
    ints[20] = this.settings.ghostMirrorMode;
    // Kaleidoscope
    ints[21] = this.settings.kaleidoscopeEnabled ? 1 : 0;
    floats[22] = this.settings.kaleidoscopeSegments;
    // Wave Distortion
    ints[23] = this.settings.waveEnabled ? 1 : 0;
    floats[24] = this.settings.waveAmplitude;
    floats[25] = this.settings.waveFrequency;
    floats[26] = performance.now() * 0.001; // time in seconds
    // Feedback Trails — decay strength fades between snapshots so trails don't sit static
    ints[27] = this.settings.feedbackEnabled ? 1 : 0;
    if (this.settings.feedbackEnabled && this.settings.feedbackInterval > 0) {
      const timeSinceSnapshot = performance.now() - this.lastSnapshotTime;
      const fadeRate = 1.5 / this.settings.feedbackInterval;
      floats[28] = this.settings.feedbackDecay * Math.exp(-fadeRate * timeSinceSnapshot);
    } else {
      floats[28] = this.settings.feedbackDecay;
    }

    this.device.queue.writeBuffer(this.uniformBuffer, 0, data);
  }

  destroy(): void {
    this.intermediateTexture?.destroy();
    this.bloomExtractTexture?.destroy();
    this.bloomBlurTempTexture?.destroy();
    this.bloomBlurTexture?.destroy();
    this.feedbackTextureA?.destroy();
    this.feedbackTextureB?.destroy();
    this.uniformBuffer.destroy();
    this.blurHUniformBuffer.destroy();
    this.blurVUniformBuffer.destroy();
  }
}
