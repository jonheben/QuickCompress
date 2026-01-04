interface CompressionResult {
  originalName: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  outputPath: string;
  success: boolean;
  error?: string;
}

interface ProgressData {
  completed: number;
  total: number;
  fileName: string;
  success: boolean;
}

export interface ElectronAPI {
  compressImages: (
    imagePaths: string[],
    quality: number
  ) => Promise<{
    success: boolean;
    results?: CompressionResult[];
    error?: string;
  }>;
  openFolder: (filePath: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  selectOutputDirectory: () => Promise<{
    success: boolean;
    path?: string;
    canceled?: boolean;
    error?: string;
  }>;
  onCompressionProgress: (callback: (data: ProgressData) => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
