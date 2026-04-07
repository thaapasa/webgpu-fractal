/**
 * Post-Processing State - Settings, presets, and defaults
 *
 * "Instagram filters? Please. These are ARTISANAL SHADER PRESETS."
 * - Skippy the Magnificent
 */

export interface PostProcessSettings {
  enabled: boolean;

  // Bloom: bright areas bleed light into surroundings
  bloomEnabled: boolean;
  bloomThreshold: number; // 0.0–2.0 (luminance cutoff)
  bloomIntensity: number; // 0.0–1.0 (blend strength)

  // Vignette: cinematic edge darkening
  vignetteEnabled: boolean;
  vignetteIntensity: number; // 0.0–1.0
  vignetteSoftness: number; // 0.0–1.0

  // Sharpen: adaptive detail enhancement
  sharpenEnabled: boolean;
  sharpenStrength: number; // 0.0–1.0

  // Chromatic Aberration: prismatic color fringing
  chromaticAberrationEnabled: boolean;
  chromaticAberrationIntensity: number; // 0.0–1.0

  // Tone Mapping: filmic color grading (ACES)
  toneMappingEnabled: boolean;
  exposure: number; // 0.5–2.0
  saturation: number; // 0.5–2.0
  temperature: number; // -1.0–1.0 (negative=cool, positive=warm)

  // Ghost Mirrors: translucent mirrored copies overlaid on the image
  ghostMirrorEnabled: boolean;
  ghostMirrorOpacity: number; // 0.0–1.0
  ghostMirrorMode: number; // 0=horizontal, 1=vertical, 2=both, 3=diagonal

  // Kaleidoscope: angular symmetry mandala effect
  kaleidoscopeEnabled: boolean;
  kaleidoscopeSegments: number; // number of mirror segments (e.g. 4, 6, 8)

  // Wave Distortion: animated sine-wave ripples
  waveEnabled: boolean;
  waveAmplitude: number; // 0.0–0.1 (UV offset strength)
  waveFrequency: number; // 1.0–20.0 (wave density)

  // Feedback Trails: ghostly afterimages from previous frames
  feedbackEnabled: boolean;
  feedbackDecay: number; // 0.5–0.98 (how much of the previous frame persists)
  feedbackInterval: number; // milliseconds between trail snapshots (0 = every frame)
}

export const DEFAULT_POST_PROCESS_SETTINGS: PostProcessSettings = {
  enabled: false,
  bloomEnabled: false,
  bloomThreshold: 0.8,
  bloomIntensity: 0.3,
  vignetteEnabled: false,
  vignetteIntensity: 0.4,
  vignetteSoftness: 0.5,
  sharpenEnabled: false,
  sharpenStrength: 0.3,
  chromaticAberrationEnabled: false,
  chromaticAberrationIntensity: 0.3,
  toneMappingEnabled: false,
  exposure: 1.0,
  saturation: 1.15,
  temperature: 0.0,
  ghostMirrorEnabled: false,
  ghostMirrorOpacity: 0.3,
  ghostMirrorMode: 2,
  kaleidoscopeEnabled: false,
  kaleidoscopeSegments: 6,
  waveEnabled: false,
  waveAmplitude: 0.01,
  waveFrequency: 8.0,
  feedbackEnabled: false,
  feedbackDecay: 0.85,
  feedbackInterval: 250,
};

export type PostProcessPreset =
  | 'clean'
  | 'cinematic'
  | 'vivid'
  | 'dreamy'
  | 'psychedelic'
  | 'acid'
  | 'ethereal';

export const POST_PROCESS_PRESET_NAMES: Record<PostProcessPreset, string> = {
  clean: 'Clean',
  cinematic: 'Cinematic',
  vivid: 'Vivid',
  dreamy: 'Dreamy',
  psychedelic: 'Psychedelic',
  acid: 'Acid Trip',
  ethereal: 'Ethereal',
};

export const POST_PROCESS_PRESETS: PostProcessPreset[] = [
  'clean',
  'cinematic',
  'vivid',
  'dreamy',
  'psychedelic',
  'acid',
  'ethereal',
];

const PRESET_SETTINGS: Record<PostProcessPreset, Partial<PostProcessSettings>> = {
  clean: {
    enabled: false,
    bloomEnabled: false,
    vignetteEnabled: false,
    sharpenEnabled: false,
    chromaticAberrationEnabled: false,
    toneMappingEnabled: false,
  },
  cinematic: {
    enabled: true,
    bloomEnabled: true,
    bloomThreshold: 0.8,
    bloomIntensity: 0.3,
    vignetteEnabled: true,
    vignetteIntensity: 0.4,
    vignetteSoftness: 0.5,
    sharpenEnabled: false,
    chromaticAberrationEnabled: false,
    toneMappingEnabled: true,
    exposure: 1.0,
    saturation: 1.15,
    temperature: 0.0,
  },
  vivid: {
    enabled: true,
    bloomEnabled: true,
    bloomThreshold: 0.7,
    bloomIntensity: 0.25,
    vignetteEnabled: false,
    sharpenEnabled: true,
    sharpenStrength: 0.4,
    chromaticAberrationEnabled: false,
    toneMappingEnabled: true,
    exposure: 1.0,
    saturation: 1.3,
    temperature: 0.0,
  },
  dreamy: {
    enabled: true,
    bloomEnabled: true,
    bloomThreshold: 0.5,
    bloomIntensity: 0.5,
    vignetteEnabled: true,
    vignetteIntensity: 0.3,
    vignetteSoftness: 0.6,
    sharpenEnabled: false,
    chromaticAberrationEnabled: true,
    chromaticAberrationIntensity: 0.3,
    toneMappingEnabled: false,
  },
  psychedelic: {
    enabled: true,
    bloomEnabled: true,
    bloomThreshold: 0.6,
    bloomIntensity: 0.4,
    vignetteEnabled: true,
    vignetteIntensity: 0.3,
    vignetteSoftness: 0.5,
    ghostMirrorEnabled: true,
    ghostMirrorOpacity: 0.25,
    ghostMirrorMode: 2,
    kaleidoscopeEnabled: true,
    kaleidoscopeSegments: 6,
    toneMappingEnabled: true,
    saturation: 1.4,
  },
  acid: {
    enabled: true,
    bloomEnabled: true,
    bloomThreshold: 0.5,
    bloomIntensity: 0.5,
    kaleidoscopeEnabled: true,
    kaleidoscopeSegments: 8,
    waveEnabled: true,
    waveAmplitude: 0.015,
    waveFrequency: 10.0,
    chromaticAberrationEnabled: true,
    chromaticAberrationIntensity: 0.5,
    toneMappingEnabled: true,
    saturation: 1.5,
    temperature: 0.3,
  },
  ethereal: {
    enabled: true,
    bloomEnabled: true,
    bloomThreshold: 0.5,
    bloomIntensity: 0.4,
    ghostMirrorEnabled: true,
    ghostMirrorOpacity: 0.2,
    ghostMirrorMode: 2,
    vignetteEnabled: true,
    vignetteIntensity: 0.3,
    vignetteSoftness: 0.5,
    feedbackEnabled: true,
    feedbackDecay: 0.5,
    feedbackInterval: 250,
  },
};

/**
 * Apply a preset to settings, returning a new settings object.
 */
export function applyPreset(preset: PostProcessPreset): PostProcessSettings {
  return { ...DEFAULT_POST_PROCESS_SETTINGS, ...PRESET_SETTINGS[preset] };
}
