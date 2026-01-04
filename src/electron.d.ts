export interface ElectronAPI {
  compressImages: (imagePaths: string[], quality: number) => Promise<{
    success: boolean;
    results?: any[];
    error?: string;
  }>;
  openFolder: (filePath: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
