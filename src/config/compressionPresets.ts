export type PresetKey = 'webOptimized' | 'highQuality' | 'smallFile' | 'custom';

export interface CompressionPreset {
  quality: number;
  label: string;
  description: string;
}

export const COMPRESSION_PRESETS: Record<PresetKey, CompressionPreset> = {
  webOptimized: {
    quality: 70,
    label: 'Web Optimized',
    description: 'Balanced quality and file size, perfect for websites',
  },
  highQuality: {
    quality: 85,
    label: 'High Quality',
    description: 'Minimal quality loss, ideal for professional use',
  },
  smallFile: {
    quality: 55,
    label: 'Small File',
    description: 'Maximum compression, great for social media',
  },
  custom: {
    quality: 75,
    label: 'Custom',
    description: 'Manually adjust quality with the slider',
  },
};

export const DEFAULT_PRESET: PresetKey = 'webOptimized';
