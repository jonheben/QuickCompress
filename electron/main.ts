import { app, BrowserWindow } from 'electron';
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
      if (args[i + 2] && !isNaN(parseInt(args[i + 2]))) {
        cliMode.quality = parseInt(args[i + 2]);
      }
    }
  }

  return cliMode;
}

// Run compression in CLI mode without GUI
async function runCliMode(filePath: string, quality: number) {

  try {
    logger.info('Running in CLI mode', { filePath, quality });

    const result = await compressImage(filePath, { mode: 'quality', format: 'lossy', quality });

    if (result.success) {
      logger.info('Compression successful', {
        outputPath: result.outputPath,
        compressionRatio: result.compressionRatio,
      });
      console.log(`✓ Compressed: ${result.outputPath}`);
      console.log(`  Original: ${(result.originalSize / 1024).toFixed(2)} KB`);
      console.log(`  Compressed: ${(result.compressedSize / 1024).toFixed(2)} KB`);
      console.log(`  Saved: ${result.compressionRatio.toFixed(1)}%`);
      app.exit(0);
    } else {
      logger.error('Compression failed', { error: result.error });
      console.error(`✗ Error: ${result.error}`);
      app.exit(1);
    }
  } catch (error) {
    logger.error('Unexpected error in CLI mode', { error });
    console.error(`✗ Unexpected error: ${error}`);
    app.exit(1);
  }
}

// Create the main application window
function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0D0D0D',
      symbolColor: '#FFFFFF',
      height: 40,
    },
    backgroundColor: '#0D0D0D',
    show: false,
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow!.loadURL('http://localhost:5173');
    mainWindow!.webContents.openDevTools();
  } else {
    mainWindow!.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Show window when ready
  mainWindow!.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow!.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(async () => {

  setupIpcHandlers();

  // Check if running in CLI mode
  const cliMode = parseCliArgs();

  if (cliMode.enabled && cliMode.filePath) {
    // Run in CLI mode without opening window
    await runCliMode(cliMode.filePath, cliMode.quality);
  } else {
    // Normal GUI mode
    createWindow();
  }

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
