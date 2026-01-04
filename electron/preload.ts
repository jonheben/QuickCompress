import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  compressImages: (imagePaths: string[], quality: number) =>
    ipcRenderer.invoke('compress-images', imagePaths, quality),
  openFolder: (filePath: string) =>
    ipcRenderer.invoke('open-folder', filePath),
});

// Type declaration for the exposed API
export interface ElectronAPI {
  compressImages: (imagePaths: string[], quality: number) => Promise<any>;
  openFolder: (filePath: string) => Promise<any>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
