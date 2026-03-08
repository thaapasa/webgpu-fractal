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
};

export type PostProcessPreset = 'clean' | 'cinematic' | 'vivid' | 'dreamy';

export const POST_PROCESS_PRESET_NAMES: Record<PostProcessPreset, string> = {
  clean: 'Clean',
  cinematic: 'Cinematic',
  vivid: 'Vivid',
  dreamy: 'Dreamy',
};

export const POST_PROCESS_PRESETS: PostProcessPreset[] = ['clean', 'cinematic', 'vivid', 'dreamy'];

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
};

/**
 * Apply a preset to settings, returning a new settings object.
 */
export function applyPreset(preset: PostProcessPreset): PostProcessSettings {
  return { ...DEFAULT_POST_PROCESS_SETTINGS, ...PRESET_SETTINGS[preset] };
}
