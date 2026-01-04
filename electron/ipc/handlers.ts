import { ipcMain, shell } from 'electron';
import { compressImages } from '../services/compressionService';
import path from 'path';

export function setupIpcHandlers() {
  // Handle image compression requests
  ipcMain.handle('compress-images', async (_event, imagePaths: string[], quality: number) => {
    try {
      const results = await compressImages(imagePaths, quality);
      return { success: true, results };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  });

  // Handle opening folder in file explorer
  ipcMain.handle('open-folder', async (_event, filePath: string) => {
    try {
      const folderPath = path.dirname(filePath);
      await shell.openPath(folderPath);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Could not open folder'
      };
    }
  });
}
