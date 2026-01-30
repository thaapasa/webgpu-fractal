var C=Object.defineProperty;var S=(a,e,t)=>e in a?C(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var i=(a,e,t)=>S(a,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();class A{constructor(e){i(this,"gl");i(this,"canvas");i(this,"animationFrameId",null);i(this,"renderCallback",null);this.canvas=e;const t=e.getContext("webgl2",{antialias:!1,depth:!1,stencil:!1,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)throw new Error("WebGL 2 is not supported in this browser");this.gl=t,e.addEventListener("webglcontextlost",n=>{n.preventDefault(),this.stop(),console.warn("WebGL context lost")}),e.addEventListener("webglcontextrestored",()=>{console.log("WebGL context restored")})}resize(e,t){const n=window.devicePixelRatio||1;this.canvas.width=e*n,this.canvas.height=t*n,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`,this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}clear(e=0,t=0,n=0,r=1){this.gl.clearColor(e,t,n,r),this.gl.clear(this.gl.COLOR_BUFFER_BIT)}start(e){if(this.animationFrameId!==null)return;this.renderCallback=e;const t=()=>{this.renderCallback&&this.renderCallback(),this.animationFrameId=requestAnimationFrame(t)};this.animationFrameId=requestAnimationFrame(t)}stop(){this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.renderCallback=null}destroy(){this.stop()}}class p{constructor(e,t,n){i(this,"program");i(this,"gl");i(this,"uniformLocations",new Map);i(this,"warnedUniforms",new Set);this.gl=e;const r=this.compileShader(e.VERTEX_SHADER,t),s=this.compileShader(e.FRAGMENT_SHADER,n);this.program=this.linkProgram(r,s),e.deleteShader(r),e.deleteShader(s)}compileShader(e,t){const n=this.gl.createShader(e);if(!n)throw new Error(`Failed to create ${e===this.gl.VERTEX_SHADER?"vertex":"fragment"} shader`);if(this.gl.shaderSource(n,t),this.gl.compileShader(n),!this.gl.getShaderParameter(n,this.gl.COMPILE_STATUS)){const r=this.gl.getShaderInfoLog(n),o=`Shader compilation error (${e===this.gl.VERTEX_SHADER?"VERTEX":"FRAGMENT"}):
${r}

Shader source:
${t}`;throw this.gl.deleteShader(n),new Error(o)}return n}linkProgram(e,t){const n=this.gl.createProgram();if(!n)throw new Error("Failed to create shader program");if(this.gl.attachShader(n,e),this.gl.attachShader(n,t),this.gl.linkProgram(n),!this.gl.getProgramParameter(n,this.gl.LINK_STATUS)){const r=this.gl.getProgramInfoLog(n);throw this.gl.deleteProgram(n),new Error(`Program linking error:
${r}`)}return n}getUniformLocation(e){if(this.uniformLocations.has(e))return this.uniformLocations.get(e);const t=this.gl.getUniformLocation(this.program,e);return this.uniformLocations.set(e,t),t}warnMissingUniform(e){this.warnedUniforms.has(e)||(this.warnedUniforms.add(e),console.warn(`Uniform "${e}" not found in shader program (may be optimized out)`))}use(){this.gl.useProgram(this.program)}setUniform(e,t){const n=this.getUniformLocation(e);if(n===null){this.warnMissingUniform(e);return}typeof t=="number"?this.gl.uniform1f(n,t):t.length===2?this.gl.uniform2f(n,t[0],t[1]):t.length===3?this.gl.uniform3f(n,t[0],t[1],t[2]):t.length===4&&this.gl.uniform4f(n,t[0],t[1],t[2],t[3])}setUniformInt(e,t){const n=this.getUniformLocation(e);if(n===null){this.warnMissingUniform(e);return}this.gl.uniform1i(n,t)}destroy(){this.gl.deleteProgram(this.program),this.uniformLocations.clear(),this.warnedUniforms.clear()}}class I{constructor(e=-.5,t=0,n=1){i(this,"centerX");i(this,"centerY");i(this,"zoom");this.centerX=e,this.centerY=t,this.zoom=n}pan(e,t,n,r){const s=-e/(this.zoom*n),o=t/(this.zoom*r);this.centerX+=s,this.centerY+=o}zoomAt(e,t,n,r,s){const o=this.centerX+(e/r-.5)/this.zoom,c=this.centerY-(t/s-.5)/this.zoom;this.zoom*=n,this.zoom=Math.max(.1,Math.min(this.zoom,1e15));const d=this.centerX+(e/r-.5)/this.zoom,u=this.centerY-(t/s-.5)/this.zoom;this.centerX+=o-d,this.centerY+=c-u}toFractalCoords(e,t,n,r){const s=this.centerX+(e/n-.5)/this.zoom,o=this.centerY-(t/r-.5)/this.zoom;return[s,o]}toScreenCoords(e,t,n,r){const s=(e-this.centerX)*this.zoom*n+n*.5,o=-(t-this.centerY)*this.zoom*r+r*.5;return[s,o]}reset(){this.centerX=-.5,this.centerY=0,this.zoom=1}}const _=.6;function f(a){return 1+(a-1)*_}class R{constructor(e,t,n){i(this,"canvas");i(this,"viewState");i(this,"onChange");i(this,"onIterationAdjust",null);i(this,"onIterationReset",null);i(this,"onPaletteCycle",null);i(this,"onColorOffset",null);i(this,"onToggleAA",null);i(this,"onFractalCycle",null);i(this,"isDragging",!1);i(this,"lastX",0);i(this,"lastY",0);i(this,"lastTouchDistance",0);this.canvas=e,this.viewState=t,this.onChange=n,this.setupEventListeners()}setIterationAdjustCallback(e){this.onIterationAdjust=e}setIterationResetCallback(e){this.onIterationReset=e}setPaletteCycleCallback(e){this.onPaletteCycle=e}setColorOffsetCallback(e){this.onColorOffset=e}setToggleAACallback(e){this.onToggleAA=e}setFractalCycleCallback(e){this.onFractalCycle=e}setupEventListeners(){this.canvas.addEventListener("mousedown",this.handleMouseDown.bind(this)),this.canvas.addEventListener("mousemove",this.handleMouseMove.bind(this)),this.canvas.addEventListener("mouseup",this.handleMouseUp.bind(this)),this.canvas.addEventListener("mouseleave",this.handleMouseUp.bind(this)),this.canvas.addEventListener("wheel",this.handleWheel.bind(this),{passive:!1}),this.canvas.addEventListener("dblclick",this.handleDoubleClick.bind(this)),this.canvas.addEventListener("touchstart",this.handleTouchStart.bind(this),{passive:!1}),this.canvas.addEventListener("touchmove",this.handleTouchMove.bind(this),{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd.bind(this)),this.canvas.addEventListener("touchcancel",this.handleTouchEnd.bind(this)),this.canvas.addEventListener("contextmenu",e=>e.preventDefault()),window.addEventListener("keydown",this.handleKeyDown.bind(this))}getCanvasRect(){return this.canvas.getBoundingClientRect()}getScreenCoords(e,t){const n=this.getCanvasRect();return[e-n.left,t-n.top]}getCanvasSize(){const e=this.getCanvasRect();return[e.width,e.height]}notifyChange(){this.onChange(this.viewState)}handleMouseDown(e){if(e.button!==0)return;this.isDragging=!0;const[t,n]=this.getScreenCoords(e.clientX,e.clientY);this.lastX=t,this.lastY=n,this.canvas.style.cursor="grabbing"}handleMouseMove(e){if(!this.isDragging)return;const[t,n]=this.getScreenCoords(e.clientX,e.clientY),r=t-this.lastX,s=n-this.lastY,[o,c]=this.getCanvasSize();this.viewState.pan(r,s,o,c),this.notifyChange(),this.lastX=t,this.lastY=n}handleMouseUp(){this.isDragging&&(this.isDragging=!1,this.canvas.style.cursor="grab")}handleWheel(e){e.preventDefault();const[t,n]=this.getScreenCoords(e.clientX,e.clientY),r=e.deltaY>0?.9:1.1,s=f(r),[o,c]=this.getCanvasSize();this.viewState.zoomAt(t,n,s,o,c),this.notifyChange()}handleDoubleClick(e){const[t,n]=this.getScreenCoords(e.clientX,e.clientY),[r,s]=this.getCanvasSize();this.viewState.zoomAt(t,n,f(2),r,s),this.notifyChange()}getTouchDistance(e){if(e.length<2)return 0;const t=e[0].clientX-e[1].clientX,n=e[0].clientY-e[1].clientY;return Math.sqrt(t*t+n*n)}getTouchCenter(e){if(e.length===0)return[0,0];if(e.length===1)return this.getScreenCoords(e[0].clientX,e[0].clientY);const t=(e[0].clientX+e[1].clientX)/2,n=(e[0].clientY+e[1].clientY)/2;return this.getScreenCoords(t,n)}handleTouchStart(e){if(e.touches.length===1){this.isDragging=!0;const[t,n]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY);this.lastX=t,this.lastY=n}else e.touches.length===2&&(this.isDragging=!1,this.lastTouchDistance=this.getTouchDistance(e.touches))}handleTouchMove(e){if(e.preventDefault(),e.touches.length===1&&this.isDragging){const[t,n]=this.getScreenCoords(e.touches[0].clientX,e.touches[0].clientY),r=t-this.lastX,s=n-this.lastY,[o,c]=this.getCanvasSize();this.viewState.pan(r,s,o,c),this.notifyChange(),this.lastX=t,this.lastY=n}else if(e.touches.length===2){const t=this.getTouchDistance(e.touches),n=this.getTouchCenter(e.touches);if(this.lastTouchDistance>0){const r=t/this.lastTouchDistance,s=f(r),[o,c]=this.getCanvasSize();this.viewState.zoomAt(n[0],n[1],s,o,c),this.notifyChange()}this.lastTouchDistance=t}}handleTouchEnd(){this.isDragging=!1,this.lastTouchDistance=0}handleKeyDown(e){if(!(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement))switch(e.key){case"+":case"=":e.preventDefault(),this.onIterationAdjust?.(1);break;case"-":case"_":e.preventDefault(),this.onIterationAdjust?.(-1);break;case"0":e.preventDefault(),this.onIterationReset?.();break;case"c":e.preventDefault(),this.onPaletteCycle?.(1);break;case"C":e.preventDefault(),this.onPaletteCycle?.(-1);break;case"[":case",":e.preventDefault(),this.onColorOffset?.(-.1);break;case"]":case".":e.preventDefault(),this.onColorOffset?.(.1);break;case"{":case"<":e.preventDefault(),this.onColorOffset?.(-.5);break;case"}":case">":e.preventDefault(),this.onColorOffset?.(.5);break;case"a":case"A":e.preventDefault(),this.onToggleAA?.();break;case"f":e.preventDefault(),this.onFractalCycle?.(1);break;case"F":e.preventDefault(),this.onFractalCycle?.(-1);break}}destroy(){}}var g=(a=>(a[a.Mandelbrot=0]="Mandelbrot",a[a.BurningShip=1]="BurningShip",a))(g||{});const F={0:"Mandelbrot",1:"Burning Ship"},b=`#version 300 es

/**
 * Vertex Shader - Fullscreen Quad
 *
 * "Two triangles. That's it. Even a monkey could understand this."
 * - Skippy the Magnificent
 */

layout(location = 0) in vec2 a_position;

out vec2 v_uv;

void main() {
  // Pass through position as UV coordinates (ranging from 0 to 1)
  v_uv = a_position;
  
  // Map to clip space (-1 to 1)
  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
}
`,M=`#version 300 es

/**
 * Fragment Shader - Mandelbrot Set Computation
 *
 * "This is where the magic happens. On the GPU. In parallel. For every pixel.
 *  Simultaneously. You're welcome."
 * - Skippy the Magnificent
 */

precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;      // Canvas size in pixels
uniform vec2 u_center;          // Current view center in fractal coordinates
uniform float u_zoom;           // Current zoom level
uniform int u_maxIterations;    // Iteration limit (quality vs performance)
uniform float u_time;           // Time in seconds (for animations)
uniform int u_paletteIndex;     // Which color palette to use (0-7)
uniform float u_colorOffset;    // Offset to shift the color cycle
uniform int u_fractalType;      // 0 = Mandelbrot, 1 = Burning Ship

// Attempt at magnificent color palettes using cosine gradients
// Formula: color = a + b * cos(2π * (c * t + d))
// Each palette defined by vec3 a, b, c, d

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

vec3 getColor(float t, int paletteIdx, bool isCycling) {
  // For cycling palettes: wrap t to [0, 1] for repeating
  // For monotonic palettes: clamp t to [0, 1] for single gradient
  if (isCycling) {
    t = fract(t);
  } else {
    t = clamp(t, 0.0, 1.0);
  }

  if (paletteIdx == 0) {
    // Classic rainbow - the psychedelic special
    return palette(t,
      vec3(0.5, 0.5, 0.5),
      vec3(0.5, 0.5, 0.5),
      vec3(1.0, 1.0, 1.0),
      vec3(0.0, 0.33, 0.67));
  } else if (paletteIdx == 1) {
    // Blue journey - dark indigo -> teal -> cyan -> bright blue-white
    vec3 c1 = vec3(0.02, 0.01, 0.08);  // deep indigo
    vec3 c2 = vec3(0.05, 0.15, 0.25);  // dark teal
    vec3 c3 = vec3(0.1, 0.4, 0.5);     // teal
    vec3 c4 = vec3(0.3, 0.6, 0.8);     // sky blue
    vec3 c5 = vec3(0.7, 0.9, 1.0);     // bright cyan-white
    if (t < 0.25) return mix(c1, c2, t * 4.0);
    else if (t < 0.5) return mix(c2, c3, (t - 0.25) * 4.0);
    else if (t < 0.75) return mix(c3, c4, (t - 0.5) * 4.0);
    else return mix(c4, c5, (t - 0.75) * 4.0);
  } else if (paletteIdx == 2) {
    // Gold journey - dark brown -> copper -> orange -> gold -> bright yellow
    vec3 c1 = vec3(0.04, 0.02, 0.01);  // near black brown
    vec3 c2 = vec3(0.2, 0.08, 0.02);   // dark copper
    vec3 c3 = vec3(0.5, 0.25, 0.05);   // copper-orange
    vec3 c4 = vec3(0.85, 0.6, 0.2);    // gold
    vec3 c5 = vec3(1.0, 0.95, 0.7);    // bright gold-white
    if (t < 0.25) return mix(c1, c2, t * 4.0);
    else if (t < 0.5) return mix(c2, c3, (t - 0.25) * 4.0);
    else if (t < 0.75) return mix(c3, c4, (t - 0.5) * 4.0);
    else return mix(c4, c5, (t - 0.75) * 4.0);
  } else if (paletteIdx == 3) {
    // Grayscale with subtle blue tint at shadows, warm at highlights
    vec3 c1 = vec3(0.01, 0.01, 0.03);  // near black, hint of blue
    vec3 c2 = vec3(0.15, 0.15, 0.17);  // dark gray, cool
    vec3 c3 = vec3(0.45, 0.45, 0.45);  // mid gray
    vec3 c4 = vec3(0.75, 0.74, 0.72);  // light gray, hint warm
    vec3 c5 = vec3(1.0, 0.98, 0.95);   // warm white
    if (t < 0.25) return mix(c1, c2, t * 4.0);
    else if (t < 0.5) return mix(c2, c3, (t - 0.25) * 4.0);
    else if (t < 0.75) return mix(c3, c4, (t - 0.5) * 4.0);
    else return mix(c4, c5, (t - 0.75) * 4.0);
  } else if (paletteIdx == 4) {
    // Fire - hot hot hot
    return palette(t,
      vec3(0.5, 0.5, 0.5),
      vec3(0.5, 0.5, 0.5),
      vec3(1.0, 1.0, 0.5),
      vec3(0.0, 0.1, 0.2));
  } else if (paletteIdx == 5) {
    // Ice - cool blues and cyans
    return palette(t,
      vec3(0.5, 0.5, 0.5),
      vec3(0.5, 0.5, 0.5),
      vec3(1.0, 0.7, 0.4),
      vec3(0.0, 0.15, 0.20));
  } else if (paletteIdx == 6) {
    // Sepia journey - dark brown -> warm brown -> tan -> cream
    vec3 c1 = vec3(0.03, 0.02, 0.01);  // near black
    vec3 c2 = vec3(0.15, 0.08, 0.03);  // dark brown
    vec3 c3 = vec3(0.4, 0.25, 0.12);   // warm brown
    vec3 c4 = vec3(0.7, 0.55, 0.35);   // tan
    vec3 c5 = vec3(1.0, 0.95, 0.85);   // cream white
    if (t < 0.25) return mix(c1, c2, t * 4.0);
    else if (t < 0.5) return mix(c2, c3, (t - 0.25) * 4.0);
    else if (t < 0.75) return mix(c3, c4, (t - 0.5) * 4.0);
    else return mix(c4, c5, (t - 0.75) * 4.0);
  } else if (paletteIdx == 7) {
    // Ocean journey - abyss -> deep blue -> teal -> seafoam -> bright
    vec3 c1 = vec3(0.0, 0.02, 0.05);   // abyss
    vec3 c2 = vec3(0.02, 0.08, 0.2);   // deep blue
    vec3 c3 = vec3(0.05, 0.3, 0.4);    // ocean teal
    vec3 c4 = vec3(0.2, 0.6, 0.6);     // seafoam
    vec3 c5 = vec3(0.6, 0.95, 0.9);    // bright aqua
    if (t < 0.25) return mix(c1, c2, t * 4.0);
    else if (t < 0.5) return mix(c2, c3, (t - 0.25) * 4.0);
    else if (t < 0.75) return mix(c3, c4, (t - 0.5) * 4.0);
    else return mix(c4, c5, (t - 0.75) * 4.0);
  } else if (paletteIdx == 8) {
    // Purple journey - dark violet -> purple -> magenta -> pink -> bright
    vec3 c1 = vec3(0.03, 0.01, 0.06);  // near black violet
    vec3 c2 = vec3(0.15, 0.05, 0.25);  // dark purple
    vec3 c3 = vec3(0.4, 0.15, 0.5);    // purple
    vec3 c4 = vec3(0.7, 0.4, 0.75);    // orchid
    vec3 c5 = vec3(0.95, 0.8, 1.0);    // bright pink-white
    if (t < 0.25) return mix(c1, c2, t * 4.0);
    else if (t < 0.5) return mix(c2, c3, (t - 0.25) * 4.0);
    else if (t < 0.75) return mix(c3, c4, (t - 0.5) * 4.0);
    else return mix(c4, c5, (t - 0.75) * 4.0);
  } else if (paletteIdx == 9) {
    // Forest journey - dark earth -> forest -> emerald -> lime -> bright
    vec3 c1 = vec3(0.02, 0.03, 0.01);  // dark earth
    vec3 c2 = vec3(0.05, 0.12, 0.04);  // dark forest
    vec3 c3 = vec3(0.1, 0.35, 0.15);   // forest green
    vec3 c4 = vec3(0.3, 0.65, 0.3);    // emerald
    vec3 c5 = vec3(0.7, 0.95, 0.6);    // bright lime
    if (t < 0.25) return mix(c1, c2, t * 4.0);
    else if (t < 0.5) return mix(c2, c3, (t - 0.25) * 4.0);
    else if (t < 0.75) return mix(c3, c4, (t - 0.5) * 4.0);
    else return mix(c4, c5, (t - 0.75) * 4.0);
  } else if (paletteIdx == 10) {
    // Sunset - warm oranges to pinks
    return palette(t,
      vec3(0.5, 0.3, 0.2),
      vec3(0.5, 0.4, 0.3),
      vec3(1.0, 1.0, 0.5),
      vec3(0.0, 0.1, 0.2));
  } else {
    // Electric - vibrant neon (the wild one at the end)
    return palette(t,
      vec3(0.5, 0.5, 0.5),
      vec3(0.6, 0.6, 0.6),
      vec3(1.0, 1.0, 1.0),
      vec3(0.3, 0.2, 0.2));
  }
}

void main() {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uv = v_uv - 0.5;
  uv.x *= aspect;
  vec2 c = u_center + uv / u_zoom;

  vec2 z = vec2(0.0);
  int iterations = 0;
  // Loop limit must be a compile-time constant in GLSL; 65536 allows high manual overrides
  for (int i = 0; i < 65536; i++) {
    if (i >= u_maxIterations) break;
    float zMagSq = dot(z, z);
    if (zMagSq > 4.0) break;

    // Mandelbrot: z = z² + c
    // Burning Ship: z = (|Re(z)| - i|Im(z)|)² + c (note: negative imaginary for canonical orientation)
    if (u_fractalType == 1) {
      // Burning Ship - take absolute values before squaring, negate imaginary for upright ship
      z = vec2(abs(z.x), -abs(z.y));
    }
    z = vec2(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
    iterations++;
  }

  if (iterations >= u_maxIterations) {
    // Inside the set - pure black
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    // Smooth iteration count for anti-banding
    float smoothIter = float(iterations) + 1.0 - log2(log2(max(dot(z, z), 4.0)));

    // Normalize to [0, 1] based on max iterations
    float normalized = smoothIter / float(u_maxIterations);

    // Determine if this palette is monotonic (single cycle) or cycling (multiple cycles)
    // Monotonic: 1, 2, 3, 6, 7, 8, 9 (Blue, Gold, Grayscale, Sepia, Ocean, Purple, Forest)
    // Cycling: 0, 4, 5, 10, 11 (Rainbow, Fire, Ice, Sunset, Electric)
    bool isMonotonic = (u_paletteIndex >= 1 && u_paletteIndex <= 3) ||
                       (u_paletteIndex >= 6 && u_paletteIndex <= 9);

    float t;
    if (isMonotonic) {
      // Single cycle from 0 to 1 across all iterations
      t = normalized + u_colorOffset;
    } else {
      // Multiple cycles for psychedelic effect (e.g., 8 full cycles)
      float numCycles = 8.0;
      t = normalized * numCycles + u_colorOffset;
    }

    vec3 color = getColor(t, u_paletteIndex, !isMonotonic);

    // Add subtle glow near the boundary
    float edgeFactor = 1.0 - float(iterations) / float(u_maxIterations);
    float glow = pow(edgeFactor, 0.5) * 0.3;
    color = color * (1.0 + glow);

    fragColor = vec4(min(color, vec3(1.0)), 1.0);
  }
}
`,z=`#version 300 es

/**
 * Post-process: antialias by averaging colored pixels with non-black neighbors.
 * Black (set) pixels stay black; no bleeding into the set.
 * Only applies when contrast among nearby non-black pixels is high; otherwise pass-through.
 */

precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_tex;
uniform vec2 u_resolution;

const float BLACK_THRESH = 0.02;
const float CONTRAST_THRESH = 0.35;

bool isBlack(vec3 rgb) {
  return max(max(rgb.r, rgb.g), rgb.b) < BLACK_THRESH;
}

float luminance(vec3 rgb) {
  return dot(rgb, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  vec2 texel = 1.0 / u_resolution;
  vec4 center = texture(u_tex, v_uv);
  vec3 c = center.rgb;

  if (isBlack(c)) {
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  vec3 sum = c;
  float n = 1.0;
  float lumMin = luminance(c);
  float lumMax = lumMin;

  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) continue;
      vec2 uv = v_uv + vec2(float(dx), float(dy)) * texel;
      vec3 s = texture(u_tex, uv).rgb;
      if (!isBlack(s)) {
        sum += s;
        n += 1.0;
        float L = luminance(s);
        lumMin = min(lumMin, L);
        lumMax = max(lumMax, L);
      }
    }
  }

  float contrast = lumMax - lumMin;
  if (contrast < CONTRAST_THRESH) {
    fragColor = vec4(c, 1.0);
  } else {
    fragColor = vec4(sum / n, 1.0);
  }
}
`,T=256,P=4096,L=640,O=1.65,x=1.5;function y(a){const e=Math.max(1,a),t=Math.log10(e),n=T+L*Math.pow(t,O);return Math.round(Math.max(T,Math.min(P,n)))}const l=class l{constructor(e){i(this,"renderer");i(this,"shaderProgram");i(this,"postProcessProgram");i(this,"viewState");i(this,"inputHandler");i(this,"maxIterationsOverride",null);i(this,"fractalType",g.Mandelbrot);i(this,"paletteIndex",0);i(this,"colorOffset",0);i(this,"debugOverlay",null);i(this,"aaEnabled",!1);i(this,"fbo",null);i(this,"renderTarget",null);i(this,"rtWidth",0);i(this,"rtHeight",0);i(this,"quadBuffer",null);this.renderer=new A(e),this.viewState=new I,this.shaderProgram=new p(this.renderer.gl,b,M),this.postProcessProgram=new p(this.renderer.gl,b,z),this.setupGeometry(),this.setupRenderTarget(),this.inputHandler=new R(e,this.viewState,()=>{this.render()}),this.inputHandler.setIterationAdjustCallback(n=>{this.adjustMaxIterations(n)}),this.inputHandler.setIterationResetCallback(()=>{this.clearMaxIterationsOverride()}),this.inputHandler.setPaletteCycleCallback(n=>{this.cyclePalette(n)}),this.inputHandler.setColorOffsetCallback(n=>{this.adjustColorOffset(n)}),this.inputHandler.setToggleAACallback(()=>{this.toggleAA()}),this.inputHandler.setFractalCycleCallback(n=>{this.cycleFractalType(n)});const t=e.parentElement;t&&(this.debugOverlay=document.createElement("div"),this.debugOverlay.id="zoom-debug",t.appendChild(this.debugOverlay)),window.addEventListener("resize",()=>{this.handleResize()}),this.handleResize()}setupGeometry(){const e=this.renderer.gl,t=new Float32Array([0,0,1,0,0,1,1,0,1,1,0,1]);if(this.quadBuffer=e.createBuffer(),!this.quadBuffer)throw new Error("Failed to create buffer");e.bindBuffer(e.ARRAY_BUFFER,this.quadBuffer),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW)}handleResize(){this.renderer.resize(window.innerWidth,window.innerHeight),this.ensureRenderTargetSize(),this.render()}setupRenderTarget(){const e=this.renderer.gl;this.fbo=e.createFramebuffer(),this.renderTarget=e.createTexture()}ensureRenderTargetSize(){const e=this.renderer.gl,t=this.renderer.canvas.width,n=this.renderer.canvas.height;t<1||n<1||t===this.rtWidth&&n===this.rtHeight||(this.rtWidth=t,this.rtHeight=n,e.bindTexture(e.TEXTURE_2D,this.renderTarget),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,n,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,this.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.renderTarget,0),e.bindFramebuffer(e.FRAMEBUFFER,null))}render(){const e=this.renderer.gl,t=this.renderer.canvas.width,n=this.renderer.canvas.height,r=this.maxIterationsOverride??y(this.viewState.zoom);if(this.debugOverlay){const o=this.viewState.zoom,c=o>=1e6?o.toExponential(2):o<1?o.toPrecision(4):String(Math.round(o)),d=this.maxIterationsOverride!==null?" (manual)":"",u=l.PALETTE_NAMES[this.paletteIndex],w=F[this.fractalType],v=this.aaEnabled?"AA":"";this.debugOverlay.textContent=`${w}  ·  zoom ${c}  ·  iterations ${r}${d}  ·  ${u}${v?"  ·  "+v:""}`}this.aaEnabled?e.bindFramebuffer(e.FRAMEBUFFER,this.fbo):e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,t,n),this.renderer.clear(0,0,0,1),this.shaderProgram.use(),this.shaderProgram.setUniform("u_resolution",[t,n]),this.shaderProgram.setUniform("u_center",[this.viewState.centerX,this.viewState.centerY]),this.shaderProgram.setUniform("u_zoom",this.viewState.zoom),this.shaderProgram.setUniformInt("u_maxIterations",r),this.shaderProgram.setUniform("u_time",performance.now()*.001),this.shaderProgram.setUniformInt("u_paletteIndex",this.paletteIndex),this.shaderProgram.setUniform("u_colorOffset",this.colorOffset),this.shaderProgram.setUniformInt("u_fractalType",this.fractalType),e.bindBuffer(e.ARRAY_BUFFER,this.quadBuffer);const s=0;e.enableVertexAttribArray(s),e.vertexAttribPointer(s,2,e.FLOAT,!1,0,0),e.drawArrays(e.TRIANGLES,0,6),this.aaEnabled&&(e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,t,n),this.renderer.clear(.05,.05,.1,1),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.renderTarget),this.postProcessProgram.use(),this.postProcessProgram.setUniformInt("u_tex",0),this.postProcessProgram.setUniform("u_resolution",[t,n]),e.bindBuffer(e.ARRAY_BUFFER,this.quadBuffer),e.enableVertexAttribArray(s),e.vertexAttribPointer(s,2,e.FLOAT,!1,0,0),e.drawArrays(e.TRIANGLES,0,6))}start(){this.renderer.start(()=>{this.render()})}stop(){this.renderer.stop()}setMaxIterations(e){this.maxIterationsOverride=Math.round(Math.max(1,e)),this.render()}adjustMaxIterations(e){const t=this.maxIterationsOverride??y(this.viewState.zoom),n=e>0?t*x:t/x;this.setMaxIterations(n)}clearMaxIterationsOverride(){this.maxIterationsOverride=null,this.render()}toggleAA(){this.aaEnabled=!this.aaEnabled,this.render()}cycleFractalType(e=1){this.fractalType=(this.fractalType+e+l.FRACTAL_TYPE_COUNT)%l.FRACTAL_TYPE_COUNT,this.render()}cyclePalette(e=1){this.paletteIndex=(this.paletteIndex+e+l.PALETTE_COUNT)%l.PALETTE_COUNT,this.render()}adjustColorOffset(e){this.colorOffset+=e,this.render()}resetColorOffset(){this.colorOffset=0,this.render()}resetView(){this.viewState.reset(),this.render()}destroy(){this.stop(),this.debugOverlay?.remove(),this.debugOverlay=null,this.inputHandler.destroy(),this.shaderProgram.destroy(),this.postProcessProgram.destroy();const e=this.renderer.gl;this.fbo&&e.deleteFramebuffer(this.fbo),this.renderTarget&&e.deleteTexture(this.renderTarget),this.renderer.destroy(),this.quadBuffer&&e.deleteBuffer(this.quadBuffer)}};i(l,"FRACTAL_TYPE_COUNT",Object.keys(g).length/2),i(l,"PALETTE_COUNT",12),i(l,"PALETTE_NAMES",["Rainbow","Blue","Gold","Grayscale","Fire","Ice","Sepia","Ocean","Purple","Forest","Sunset","Electric"]);let m=l;console.log("Fractal Explorer - Initializing...");let h=null;function E(){const a=document.getElementById("app");if(!a){console.error("Could not find #app element");return}const e=document.createElement("canvas");e.id="fractal-canvas",a.appendChild(e);try{h=new m(e),h.start(),console.log("Fractal Explorer initialized successfully"),console.log("Controls:"),console.log("  - Drag to pan"),console.log("  - Scroll to zoom"),console.log("  - Double-click to zoom in"),console.log("  - Touch drag to pan (mobile)"),console.log("  - Pinch to zoom (mobile)"),console.log("  - + / - to adjust max iterations"),console.log("  - 0 to reset iterations to auto-scaling"),console.log("  - c / C to cycle color palettes (forward/backward)"),console.log("  - , / . to shift colors (fine)"),console.log("  - < / > to shift colors (coarse)"),console.log("  - a to toggle antialiasing")}catch(t){console.error("Failed to initialize Fractal Explorer:",t),a.innerHTML=`
      <div style="color: white; text-align: center; padding: 20px; font-family: system-ui, sans-serif;">
        <h1>Initialization Error</h1>
        <p>Failed to initialize the application.</p>
        <pre style="text-align: left; margin-top: 20px; color: #ff6b6b;">${t instanceof Error?t.message:String(t)}</pre>
      </div>
    `}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",E):E();window.addEventListener("beforeunload",()=>{h&&h.destroy()});
//# sourceMappingURL=index-FWPsVnpC.js.map
