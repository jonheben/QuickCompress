import log from 'electron-log';
import path from 'path';

// Configure electron-log
log.transports.file.maxSize = 10 * 1024 * 1024; // 10 MB
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

// Set log file location (lazy-loaded when needed)
log.transports.file.resolvePathFn = () => {
  try {
    const { app } = require('electron');
    return path.join(app.getPath('userData'), 'logs', 'quickcompress.log');
  } catch {
    // Fallback for when electron app is not ready
    return path.join(process.cwd(), 'logs', 'quickcompress.log');
  }
};

// Format log output
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
log.transports.console.format = '[{h}:{i}:{s}] [{level}] {text}';

interface LogMeta {
  [key: string]: unknown;
}

/**
 * Structured logger for QuickCompress
 * Provides consistent logging across the application with file rotation
 */
export const logger = {
  /**
   * Log error-level messages
   * @param message - Error message
   * @param meta - Additional metadata
   */
  error: (message: string, meta?: LogMeta): void => {
    if (meta) {
      log.error(message, meta);
    } else {
      log.error(message);
    }
  },

  /**
   * Log warning-level messages
   * @param message - Warning message
   * @param meta - Additional metadata
   */
  warn: (message: string, meta?: LogMeta): void => {
    if (meta) {
      log.warn(message, meta);
    } else {
      log.warn(message);
    }
  },

  /**
   * Log info-level messages
   * @param message - Info message
   * @param meta - Additional metadata
   */
  info: (message: string, meta?: LogMeta): void => {
    if (meta) {
      log.info(message, meta);
    } else {
      log.info(message);
    }
  },

  /**
   * Log debug-level messages
   * @param message - Debug message
   * @param meta - Additional metadata
   */
  debug: (message: string, meta?: LogMeta): void => {
    if (meta) {
      log.debug(message, meta);
    } else {
      log.debug(message);
    }
  },

  /**
   * Get the path to the log file
   * @returns Path to the log file
   */
  getLogPath: (): string => {
    return log.transports.file.getFile().path;
  },
};

export default logger;
