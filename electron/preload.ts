import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
interface ProgressData {
  completed: number;
  total: number;
  fileName: string;
  success: boolean;
}

contextBridge.exposeInMainWorld('electron', {
  compressImages: (imagePaths: string[], quality: number) =>
    ipcRenderer.invoke('compress-images', imagePaths, quality),
  openFolder: (filePath: string) => ipcRenderer.invoke('open-folder', filePath),
  selectOutputDirectory: () => ipcRenderer.invoke('select-output-directory'),
  onCompressionProgress: (callback: (data: ProgressData) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, data: ProgressData) => callback(data);
    ipcRenderer.on('compression-progress', listener);
    // Return cleanup function
    return () => ipcRenderer.removeListener('compression-progress', listener);
  },
});

// Type declaration for the exposed API
export interface CompressionResponse {
  success: boolean;
  results?: Array<{
    originalName: string;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    outputPath: string;
    success: boolean;
    error?: string;
  }>;
  error?: string;
}

export interface FolderResponse {
  success: boolean;
  error?: string;
}

export interface DirectoryResponse {
  success: boolean;
  path?: string;
  canceled?: boolean;
  error?: string;
}

export interface ElectronAPI {
  compressImages: (imagePaths: string[], quality: number) => Promise<CompressionResponse>;
  openFolder: (filePath: string) => Promise<FolderResponse>;
  selectOutputDirectory: () => Promise<DirectoryResponse>;
  onCompressionProgress: (callback: (data: ProgressData) => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
