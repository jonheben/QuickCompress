export interface ImageFile {
  id: string;
  name: string;
  path: string;
  size: number;
  preview: string; // Data URL for thumbnail
}

export interface CompressionResult {
  originalName: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  outputPath: string;
  success: boolean;
  error?: string;
}
