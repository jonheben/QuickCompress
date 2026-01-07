export type PresetKey = 'highQuality' | 'balanced' | 'maxCompression' | 'custom';

export interface CompressionPreset {
  quality: number;
  targetPercent: number;  // Default target % for this preset
  label: string;
  description: string;
}

export const COMPRESSION_PRESETS: Record<PresetKey, CompressionPreset> = {
  highQuality: {
    quality: 85,
    targetPercent: 80,
    label: 'Minimal Loss',
    description: 'Preserve quality, ideal for archival and professional use',
  },
  balanced: {
    quality: 70,
    targetPercent: 50,
    label: 'Balanced',
    description: 'Great balance between quality and file size',
  },
  maxCompression: {
    quality: 55,
    targetPercent: 25,
    label: 'Web Ready',
    description: 'Maximum compression for web and social media',
  },
  custom: {
    quality: 75,
    targetPercent: 50,
    label: 'Custom',
    description: 'Manually adjust compression parameters',
  },
};

export const DEFAULT_PRESET: PresetKey = 'balanced';
