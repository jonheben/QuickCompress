import { ipcMain, shell, dialog, BrowserWindow } from 'electron';
import { compressImages } from '../services/compressionService';
import { workerPool } from '../services/workerPool';
import { logger } from '../utils/logger';
import path from 'path';

export function setupIpcHandlers() {
  // Handle image compression requests with parallel processing
  ipcMain.handle('compress-images', async (event, imagePaths: string[], quality: number) => {
    try {
      logger.info('Compression request received', {
        fileCount: imagePaths.length,
        quality,
      });

      // Use parallel compression for 3+ files, sequential for fewer
      const useParallel = imagePaths.length >= 3;

      if (useParallel) {
        logger.info('Using parallel compression');

        const jobs = imagePaths.map((inputPath) => ({
          inputPath,
          quality,
        }));

        // Get the window to send progress events
        const window = BrowserWindow.fromWebContents(event.sender);

        const results = await workerPool.compressInParallel(jobs, (completed, total, result) => {
          // Send progress update to renderer
          if (window) {
            window.webContents.send('compression-progress', {
              completed,
              total,
              fileName: result.originalName,
              success: result.success,
            });
          }
        });

        return { success: true, results };
      } else {
        logger.info('Using sequential compression');
        const results = await compressImages(imagePaths, quality);
        return { success: true, results };
      }
    } catch (error) {
      logger.error('Compression failed', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
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
        error: error instanceof Error ? error.message : 'Could not open folder',
      };
    }
  });

  // Handle selecting output directory
  ipcMain.handle('select-output-directory', async () => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Select Output Directory',
        buttonLabel: 'Select Folder',
      });

      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, canceled: true };
      }

      return { success: true, path: result.filePaths[0] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Could not select directory',
      };
    }
  });
}
