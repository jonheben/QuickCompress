import { app, BrowserWindow, Notification } from 'electron';
import path from 'path';
import { setupIpcHandlers } from './ipc/handlers';
import { compressImage } from './services/compressionService';
import { logger } from './utils/logger';

let mainWindow: BrowserWindow | null = null;

// Parse command line arguments
function parseCliArgs() {
  const args = process.argv.slice(app.isPackaged ? 1 : 2);

  const cliMode = {
    enabled: false,
    filePath: '',
    quality: 75,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--compress' && args[i + 1]) {
      cliMode.enabled = true;
      cliMode.filePath = args[i + 1];
      i++;
    } else if (args[i] === '--quality' && args[i + 1]) {
      cliMode.quality = parseInt(args[i + 1], 10);
      i++;
    }
  }

  return cliMode;
}

// CLI compression mode
async function runCliMode(filePath: string, quality: number) {
  try {
    const result = await compressImage(filePath, quality);

    if (result.success) {
      // Show success notification
      new Notification({
        title: 'QuickCompress',
        body: `Image compressed successfully!\nSaved ${result.compressionRatio.toFixed(1)}% space`,
        icon: path.join(__dirname, '../../resources/icon.png'),
      }).show();

      logger.info('CLI compression successful', {
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio,
        outputPath: result.outputPath,
      });

      // eslint-disable-next-line no-console
      console.log('✓ Compression successful!');
      // eslint-disable-next-line no-console
      console.log(`  Original: ${(result.originalSize / 1024).toFixed(1)} KB`);
      // eslint-disable-next-line no-console
      console.log(`  Compressed: ${(result.compressedSize / 1024).toFixed(1)} KB`);
      // eslint-disable-next-line no-console
      console.log(`  Saved: ${result.compressionRatio.toFixed(1)}%`);
      // eslint-disable-next-line no-console
      console.log(`  Output: ${result.outputPath}`);

      app.quit();
    } else {
      logger.error('CLI compression failed', { error: result.error });
      // eslint-disable-next-line no-console
      console.error('✗ Compression failed:', result.error);
      app.exit(1);
    }
  } catch (error) {
    logger.error('CLI compression error', { error });
    // eslint-disable-next-line no-console
    console.error('✗ Error:', error);
    app.exit(1);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 700,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#FAFAFA',
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
  });

  // Show window when ready to avoid flickering
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Load the app
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    // Development mode: load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode: load from built files
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  setupIpcHandlers();

  // Check if running in CLI mode
  const cliMode = parseCliArgs();

  if (cliMode.enabled && cliMode.filePath) {
    // Run in CLI mode without opening window
    runCliMode(cliMode.filePath, cliMode.quality);
  } else {
    // Normal GUI mode
    createWindow();
  }

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On Windows/Linux, quit when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
