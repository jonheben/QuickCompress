import { create } from 'zustand';
import { ImageFile, CompressionResult, CompressionMode, CompressionFormat, CompressionOptions } from '../types';
import { PresetKey, DEFAULT_PRESET, COMPRESSION_PRESETS } from '../config/compressionPresets';

interface ImageStore {
  // Existing state
  images: ImageFile[];
  isProcessing: boolean;
  results: CompressionResult[];
  outputDirectory: string | null;
  originalImagePaths: { [filename: string]: string };
  error: string | null;

  // Compression configuration (NEW)
  compressionMode: CompressionMode;
  compressionFormat: CompressionFormat;
  selectedPreset: PresetKey;

  // Mode-specific parameters
  quality: number;               // For quality mode
  targetPercent: number;         // For targetPercent mode
  targetSize: number;            // For targetAbsolute mode (in KB)
  targetSizeUnit: 'KB' | 'MB';
  pngCompressionLevel: number;   // For lossless PNG (0-9)

  // Existing actions
  addImages: (images: ImageFile[]) => void;
  removeImage: (id: string) => void;
  setProcessing: (isProcessing: boolean) => void;
  setResults: (results: CompressionResult[]) => void;
  setOutputDirectory: (directory: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // NEW actions
  setCompressionMode: (mode: CompressionMode) => void;
  setCompressionFormat: (format: CompressionFormat) => void;
  setPreset: (preset: PresetKey) => void;
  setQuality: (quality: number) => void;
  setTargetPercent: (percent: number) => void;
  setTargetSize: (size: number) => void;
  setTargetSizeUnit: (unit: 'KB' | 'MB') => void;
  setPngCompressionLevel: (level: number) => void;

  // Helper to build CompressionOptions
  getCompressionOptions: () => CompressionOptions;
}

export const useImageStore = create<ImageStore>((set, get) => ({
  // Existing state defaults
  images: [],
  isProcessing: false,
  results: [],
  outputDirectory: null,
  originalImagePaths: {},
  error: null,

  // NEW state defaults
  compressionMode: 'quality',
  compressionFormat: 'lossy',
  selectedPreset: DEFAULT_PRESET,
  quality: 70,
  targetPercent: 50,
  targetSize: 500,
  targetSizeUnit: 'KB',
  pngCompressionLevel: 6,

  addImages: (newImages) =>
    set((state) => {
      const newPaths = { ...state.originalImagePaths };
      newImages.forEach((img) => {
        const filename = img.path.split(/[\\/]/).pop() || img.name;
        newPaths[filename] = img.path;
      });
      return {
        images: [...state.images, ...newImages],
        originalImagePaths: newPaths,
      };
    }),

  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    })),

  setProcessing: (isProcessing) => set({ isProcessing }),

  setResults: (results) => set({ results, error: null }),

  setOutputDirectory: (directory) => set({ outputDirectory: directory }),

  setError: (error) => set({ error }),

  // NEW compression mode actions
  setCompressionMode: (mode) =>
    set({ compressionMode: mode }),

  setCompressionFormat: (format) =>
    set({ compressionFormat: format }),

  setPreset: (preset) =>
    set((state) => {
      if (preset === 'custom') {
        return { selectedPreset: preset };
      }

      const presetConfig = COMPRESSION_PRESETS[preset];
      const updates: Partial<ImageStore> = {
        selectedPreset: preset,
      };

      // Update parameters based on current mode
      if (state.compressionMode === 'quality') {
        updates.quality = presetConfig.quality;
      } else if (state.compressionMode === 'targetPercent') {
        updates.targetPercent = presetConfig.targetPercent;
      }

      return updates;
    }),

  setQuality: (quality) =>
    set({ quality, selectedPreset: 'custom' }),

  setTargetPercent: (percent) =>
    set({ targetPercent: percent, selectedPreset: 'custom' }),

  setTargetSize: (size) =>
    set({ targetSize: size, selectedPreset: 'custom' }),

  setTargetSizeUnit: (unit) =>
    set({ targetSizeUnit: unit }),

  setPngCompressionLevel: (level) =>
    set({ pngCompressionLevel: level }),

  getCompressionOptions: () => {
    const state = get();
    return {
      mode: state.compressionMode,
      format: state.compressionFormat,
      quality: state.quality,
      targetPercent: state.targetPercent,
      targetSize: state.targetSize,
      targetSizeUnit: state.targetSizeUnit,
      pngCompressionLevel: state.pngCompressionLevel,
    };
  },

  reset: () =>
    set({
      images: [],
      isProcessing: false,
      results: [],
      outputDirectory: null,
      originalImagePaths: {},
      error: null,
      compressionMode: 'quality',
      compressionFormat: 'lossy',
      selectedPreset: DEFAULT_PRESET,
      quality: 70,
      targetPercent: 50,
      targetSize: 500,
      targetSizeUnit: 'KB',
      pngCompressionLevel: 6,
    }),
}));
