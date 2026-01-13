import { create } from 'zustand';
import {
  ImageFile,
  CompressionResult,
  CompressionMode,
  CompressionFormat,
  CompressionOptions,
} from '../types';
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
  quality: number; // For quality mode
  targetPercent: number; // For targetPercent mode (1-100%)
  targetSizeMB: number; // For targetPercent mode when viewing in MB (0.2-5 MB)
  targetSize: number; // For targetAbsolute mode (in KB)
  targetSizeUnit: 'KB' | 'MB';
  pngCompressionLevel: number; // For lossless PNG (0-9)

  // Additional options
  removeMetadata: boolean; // Strip EXIF/metadata

  // NEW: Output strategy configuration
  outputStrategy: 'subfolder' | 'suffix' | 'custom';
  subfolderName: string;
  outputSuffix: string;

  // NEW: Delete originals option
  deleteOriginals: boolean;

  // Existing actions
  addImages: (images: ImageFile[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void; // NEW: Clear all images
  updateImagePreview: (id: string, preview: string) => void;
  setProcessing: (isProcessing: boolean) => void;
  setResults: (results: CompressionResult[]) => void;
  setOutputDirectory: (directory: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  clearResults: () => void; // NEW: Clears results but keeps images/settings

  // NEW actions
  setCompressionMode: (mode: CompressionMode) => void;
  setCompressionFormat: (format: CompressionFormat) => void;
  setPreset: (preset: PresetKey) => void;
  setQuality: (quality: number) => void;
  setTargetPercent: (percent: number) => void;
  setTargetSizeMB: (sizeMB: number) => void;
  setTargetSize: (size: number) => void;
  setTargetSizeUnit: (unit: 'KB' | 'MB') => void;
  setPngCompressionLevel: (level: number) => void;
  setRemoveMetadata: (remove: boolean) => void;

  // NEW: Output strategy actions
  setOutputStrategy: (strategy: 'subfolder' | 'suffix' | 'custom') => void;
  setSubfolderName: (name: string) => void;
  setOutputSuffix: (suffix: string) => void;

  // NEW: Delete originals action
  setDeleteOriginals: (deleteOriginals: boolean) => void;

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
  targetSizeMB: 1.0,
  targetSize: 500,
  targetSizeUnit: 'KB',
  pngCompressionLevel: 6,
  removeMetadata: true,

  // NEW: Output strategy defaults
  outputStrategy: 'subfolder',
  subfolderName: 'compress',
  outputSuffix: '_comp',

  // NEW: Delete originals default
  deleteOriginals: false,

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

  clearImages: () =>
    set({
      images: [],
      originalImagePaths: {},
    }),

  updateImagePreview: (id, preview) =>
    set((state) => ({
      images: state.images.map((img) => (img.id === id ? { ...img, preview } : img)),
    })),

  setProcessing: (isProcessing) => set({ isProcessing }),

  setResults: (results) => set({ results, error: null }),

  setOutputDirectory: (directory) => set({ outputDirectory: directory }),

  setError: (error) => set({ error }),

  // NEW compression mode actions
  setCompressionMode: (mode) => set({ compressionMode: mode }),

  setCompressionFormat: (format) => set({ compressionFormat: format }),

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

  setQuality: (quality) => set({ quality, selectedPreset: 'custom' }),

  setTargetPercent: (percent) => set({ targetPercent: percent, selectedPreset: 'custom' }),

  setTargetSizeMB: (sizeMB) => set({ targetSizeMB: sizeMB, selectedPreset: 'custom' }),

  setTargetSize: (size) => set({ targetSize: size, selectedPreset: 'custom' }),

  setTargetSizeUnit: (unit) => set({ targetSizeUnit: unit }),

  setPngCompressionLevel: (level) => set({ pngCompressionLevel: level }),

  setRemoveMetadata: (remove) => set({ removeMetadata: remove }),

  // NEW: Output strategy setters
  setOutputStrategy: (strategy) => set({ outputStrategy: strategy }),

  setSubfolderName: (name) => set({ subfolderName: name }),

  setOutputSuffix: (suffix) => set({ outputSuffix: suffix }),

  // NEW: Delete originals setter
  setDeleteOriginals: (deleteOriginals) => set({ deleteOriginals }),

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
      removeMetadata: state.removeMetadata,
      deleteOriginals: state.deleteOriginals,
      outputOptions: {
        strategy: state.outputStrategy,
        subfolderName: state.subfolderName,
        suffix: state.outputSuffix,
        customPath: state.outputDirectory || undefined,
      },
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
      targetSizeMB: 1.0,
      targetSize: 500,
      targetSizeUnit: 'KB',
      pngCompressionLevel: 6,
      removeMetadata: true,
      outputStrategy: 'subfolder',
      subfolderName: 'compress',
      outputSuffix: '_comp',
      deleteOriginals: false,
    }),

  clearResults: () =>
    set({
      results: [],
      error: null,
      isProcessing: false,
      // Keeps images and settings intact
    }),
}));
