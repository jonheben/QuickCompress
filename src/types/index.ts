export interface ImageFile {
  id: string;
  name: string;
  path: string;
  size: number;
  preview: string; // Data URL for thumbnail
}

// Compression mode types
export type CompressionMode = 'quality' | 'targetPercent' | 'targetAbsolute';
export type CompressionFormat = 'lossy' | 'lossless';

// Compression options interface
export interface CompressionOptions {
  mode: CompressionMode;
  format: CompressionFormat;

  // Mode-specific parameters
  quality?: number; // For quality mode (0-100)
  targetPercent?: number; // For targetPercent mode (1-100)
  targetSize?: number; // For targetAbsolute mode (KB)
  targetSizeUnit?: 'KB' | 'MB'; // Unit for targetAbsolute

  // PNG-specific options
  pngCompressionLevel?: number; // 0-9 for lossless PNG

  // Additional options
  removeMetadata?: boolean; // Strip EXIF/GPS/metadata
}

export interface CompressionResult {
  originalName: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  outputPath: string;
  success: boolean;
  error?: string;
  iterations?: number; // For iterative modes
  targetAchieved?: boolean; // Whether target size was reached
}

export interface CompressionProgressData {
  completed: number;
  total: number;
  fileName: string;
  iteration: number;
  maxIterations: number;
  isCompletion?: boolean; // True when a file finishes, false for iteration updates
}
