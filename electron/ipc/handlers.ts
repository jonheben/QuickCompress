import { ipcMain, shell, dialog, BrowserWindow } from 'electron';
import { compressImages } from '../services/compressionService';
import { workerPool } from '../services/workerPool';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

export function setupIpcHandlers() {
  // Handle image compression requests with parallel processing
  ipcMain.handle(
    'compress-images',
    async (event, imagePaths: string[], options: any, outputDirectory?: string) => {
      try {
        // Input validation
        if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
          throw new Error('No image paths provided');
        }

        if (!options || typeof options !== 'object') {
          throw new Error('Invalid compression options');
        }

        // Validate all paths
        for (const imagePath of imagePaths) {
          if (!imagePath || typeof imagePath !== 'string') {
            throw new Error('Invalid image path');
          }

          // Security: Check for path traversal attempts
          const normalizedPath = path.normalize(imagePath);
          if (normalizedPath.includes('..')) {
            throw new Error('Invalid file path - path traversal detected');
          }

          // Check file exists
          if (!fs.existsSync(imagePath)) {
            throw new Error(`File not found: ${path.basename(imagePath)}`);
          }

          // Check file extension
          const ext = path.extname(imagePath).toLowerCase();
          if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
            throw new Error(`Unsupported file type: ${ext}`);
          }
        }

        // Validate output directory if provided
        if (outputDirectory) {
          const resolvedOutput = path.resolve(outputDirectory);
          if (!fs.existsSync(resolvedOutput)) {
            throw new Error('Output directory does not exist');
          }
        }

        logger.info('Compression request received', {
          fileCount: imagePaths.length,
          options,
          outputDirectory,
        });

        // Use parallel compression for 3+ files, sequential for fewer
        const useParallel = imagePaths.length >= 3;

        if (useParallel) {
          logger.info('Using parallel compression');

          const jobs = imagePaths.map((inputPath) => ({
            inputPath,
            options,
            outputDirectory,
          }));

          // Get the window to send progress events
          const window = BrowserWindow.fromWebContents(event.sender);

          // Track last completed count to detect completion events
          let lastCompleted = -1;

          const results = await workerPool.compressInParallel(jobs, (completed, total, result, iteration) => {
            // Send progress update to renderer
            if (window) {
              // Detect if this is a completion event (no iteration OR completed count increased)
              const isCompletion = iteration === undefined || completed > lastCompleted;

              if (isCompletion) {
                lastCompleted = completed;
              }

              window.webContents.send('compression-progress', {
                completed,
                total,
                fileName: result.originalName,
                success: result.success,
                iteration: iteration || 0,
                maxIterations: 10,
                isCompletion, // NEW: Tell renderer if this is a completion vs iteration
              });
            }
          });

          return { success: true, results };
        } else {
          logger.info('Using sequential compression');

          // Get the window to send progress events
          const window = BrowserWindow.fromWebContents(event.sender);

          // Track last completed count to detect completion events
          let lastCompletedSeq = -1;

          const results = await compressImages(
            imagePaths,
            options,
            outputDirectory,
            (completed, total, result, iteration) => {
              // Send progress update to renderer
              if (window) {
                // Detect if this is a completion event (no iteration OR completed count increased)
                const isCompletion = iteration === undefined || completed > lastCompletedSeq;

                if (isCompletion) {
                  lastCompletedSeq = completed;
                }

                window.webContents.send('compression-progress', {
                  completed,
                  total,
                  fileName: result.originalName,
                  success: result.success,
                  iteration: iteration || 0,
                  maxIterations: 10, // MAX_ITERATIONS from compression service
                  isCompletion, // NEW: Tell renderer if this is a completion vs iteration
                });
              }
            }
          );

          return { success: true, results };
        }
      } catch (error) {
        logger.error('Compression failed', { error });
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    }
  );

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

  // Handle loading image as base64 data URL
  ipcMain.handle('load-image', async (_event, imagePath: string) => {
    try {
      // Security: Only allow reading files with image extensions
      const ext = path.extname(imagePath).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        throw new Error('Invalid file type');
      }

      const imageBuffer = await fs.promises.readFile(imagePath);
      const base64 = imageBuffer.toString('base64');
      const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return { success: true, dataUrl };
    } catch (error) {
      logger.error('Failed to load image', { imagePath, error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Could not load image',
      };
    }
  });

  // Handle recursive folder scanning for images with progress updates
  ipcMain.handle('scan-folder', async (event, folderPath: string) => {
    try {
      logger.info('Scanning folder for images', { folderPath });

      const imagePaths: string[] = [];
      const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
      const MAX_IMAGES = 1000;
      const PROGRESS_INTERVAL = 10; // Send progress every N images

      // Get the window to send progress events
      const window = BrowserWindow.fromWebContents(event.sender);
      const folderName = path.basename(folderPath);

      function scanDirectory(dirPath: string) {
        if (imagePaths.length >= MAX_IMAGES) {
          return;
        }

        try {
          const entries = fs.readdirSync(dirPath, { withFileTypes: true });

          for (const entry of entries) {
            if (imagePaths.length >= MAX_IMAGES) {
              break;
            }

            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory()) {
              // Recursively scan subdirectories
              scanDirectory(fullPath);
            } else if (entry.isFile()) {
              const ext = path.extname(entry.name).toLowerCase();
              if (IMAGE_EXTENSIONS.includes(ext)) {
                imagePaths.push(fullPath);

                // Send progress update every N images
                if (window && imagePaths.length % PROGRESS_INTERVAL === 0) {
                  window.webContents.send('scan-progress', {
                    count: imagePaths.length,
                    folderName,
                  });
                }
              }
            }
          }
        } catch (err) {
          // Skip directories we can't access (permissions)
          logger.warn('Could not access directory', { dirPath, error: err });
        }
      }

      scanDirectory(folderPath);

      // Send final progress update
      if (window) {
        window.webContents.send('scan-progress', {
          count: imagePaths.length,
          folderName,
          done: true,
        });
      }

      logger.info('Folder scan complete', { count: imagePaths.length });
      return { success: true, imagePaths, folderName };
    } catch (error) {
      logger.error('Folder scan failed', { folderPath, error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Could not scan folder',
      };
    }
  });
}
