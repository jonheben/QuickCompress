import { CompressionOptions, CompressionResult } from './types';

interface ProgressData {
  completed: number;
  total: number;
  fileName: string;
  success: boolean;
  iteration?: number;       // NEW: Current iteration for iterative modes
  maxIterations?: number;   // NEW: Max iterations for iterative modes
  isCompletion?: boolean;   // True when a file finishes, false for iteration updates
}

interface ScanProgressData {
  count: number;
  folderName: string;
  done?: boolean;
}

export interface ElectronAPI {
  compressImages: (
    imagePaths: string[],
    options: CompressionOptions,  // Changed from quality: number
    outputDirectory?: string
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
  loadImage: (imagePath: string) => Promise<{
    success: boolean;
    dataUrl?: string;
    error?: string;
  }>;
  scanFolder: (folderPath: string) => Promise<{
    success: boolean;
    imagePaths?: string[];
    folderName?: string;
    error?: string;
  }>;
  onCompressionProgress: (callback: (data: ProgressData) => void) => () => void;
  onScanProgress: (callback: (data: ScanProgressData) => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
