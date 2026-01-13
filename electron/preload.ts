import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
interface ProgressData {
  completed: number;
  total: number;
  fileName: string;
  success: boolean;
  iteration?: number;
  maxIterations?: number;
  isCompletion?: boolean; // True when a file finishes, false for iteration updates
}

interface ScanProgressData {
  count: number;
  folderName: string;
  done?: boolean;
}

contextBridge.exposeInMainWorld('electron', {
  compressImages: (imagePaths: string[], options: any, outputDirectory?: string) =>
    ipcRenderer.invoke('compress-images', imagePaths, options, outputDirectory),
  openFolder: (filePath: string) => ipcRenderer.invoke('open-folder', filePath),
  selectOutputDirectory: () => ipcRenderer.invoke('select-output-directory'),
  loadImage: (imagePath: string) => ipcRenderer.invoke('load-image', imagePath),
  scanFolder: (folderPath: string) => ipcRenderer.invoke('scan-folder', folderPath),
  onCompressionProgress: (callback: (data: ProgressData) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, data: ProgressData) => callback(data);
    ipcRenderer.on('compression-progress', listener);
    // Return cleanup function
    return () => ipcRenderer.removeListener('compression-progress', listener);
  },
  onScanProgress: (callback: (data: ScanProgressData) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, data: ScanProgressData) => callback(data);
    ipcRenderer.on('scan-progress', listener);
    // Return cleanup function
    return () => ipcRenderer.removeListener('scan-progress', listener);
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

export interface LoadImageResponse {
  success: boolean;
  dataUrl?: string;
  error?: string;
}

export interface ScanFolderResponse {
  success: boolean;
  imagePaths?: string[];
  folderName?: string;
  error?: string;
}

export interface ElectronAPI {
  compressImages: (
    imagePaths: string[],
    options: any,
    outputDirectory?: string
  ) => Promise<CompressionResponse>;
  openFolder: (filePath: string) => Promise<FolderResponse>;
  selectOutputDirectory: () => Promise<DirectoryResponse>;
  loadImage: (imagePath: string) => Promise<LoadImageResponse>;
  scanFolder: (folderPath: string) => Promise<ScanFolderResponse>;
  onCompressionProgress: (callback: (data: ProgressData) => void) => () => void;
  onScanProgress: (callback: (data: { count: number; folderName: string; done?: boolean }) => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
