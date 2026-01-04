import { create } from 'zustand';
import { ImageFile, CompressionResult } from '../types';
import { PresetKey, DEFAULT_PRESET } from '../config/compressionPresets';

interface ImageStore {
  images: ImageFile[];
  quality: number;
  selectedPreset: PresetKey;
  isProcessing: boolean;
  results: CompressionResult[];

  // Actions
  addImages: (images: ImageFile[]) => void;
  removeImage: (id: string) => void;
  setQuality: (quality: number) => void;
  setPreset: (preset: PresetKey) => void;
  setProcessing: (isProcessing: boolean) => void;
  setResults: (results: CompressionResult[]) => void;
  reset: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  quality: 70, // Default quality from webOptimized preset
  selectedPreset: DEFAULT_PRESET,
  isProcessing: false,
  results: [],

  addImages: (newImages) =>
    set((state) => ({
      images: [...state.images, ...newImages],
    })),

  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    })),

  setQuality: (quality) =>
    set({
      quality,
      selectedPreset: 'custom', // Auto-switch to custom when slider is manually adjusted
    }),

  setPreset: (preset) =>
    set((state) => {
      if (preset === 'custom') {
        // Keep current quality when switching to custom
        return { selectedPreset: preset };
      }
      // Update quality when selecting a preset
      const presetQuality = {
        webOptimized: 70,
        highQuality: 85,
        smallFile: 55,
        custom: state.quality,
      }[preset];

      return {
        selectedPreset: preset,
        quality: presetQuality,
      };
    }),

  setProcessing: (isProcessing) => set({ isProcessing }),

  setResults: (results) => set({ results, isProcessing: false }),

  reset: () =>
    set({
      images: [],
      quality: 70,
      selectedPreset: DEFAULT_PRESET,
      isProcessing: false,
      results: [],
    }),
}));
