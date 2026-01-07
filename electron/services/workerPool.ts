import { Worker } from 'worker_threads';
import os from 'os';
import path from 'path';
import { logger } from '../utils/logger';

interface CompressionJob {
  inputPath: string;
  options: any;
  outputDirectory?: string;
}

interface CompressionResult {
  success: boolean;
  originalName: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  outputPath: string;
  error?: string;
}

/**
 * Worker Pool for parallel image compression
 * Uses worker threads to process multiple images simultaneously
 */
class WorkerPool {
  private poolSize: number;
  private workerPath: string;

  constructor() {
    // Use CPU count - 1 to leave one core for the main process
    this.poolSize = Math.max(1, os.cpus().length - 1);
    // In development, the worker is in the electron folder
    // In production, it's in the dist/electron folder
    this.workerPath = path.join(__dirname, 'workers', 'compressionWorker.js');

    // Verify worker file exists
    const fs = require('fs');
    if (!fs.existsSync(this.workerPath)) {
      console.error('[WorkerPool] Worker file not found at:', this.workerPath);
      console.error('[WorkerPool] __dirname is:', __dirname);
      console.error('[WorkerPool] Attempting alternative path...');
      // Try alternative path for development
      const altPath = path.join(__dirname, '..', '..', 'electron', 'workers', 'compressionWorker.js');
      if (fs.existsSync(altPath)) {
        this.workerPath = altPath;
        console.log('[WorkerPool] Using alternative path:', this.workerPath);
      }
    } else {
      console.log('[WorkerPool] Worker initialized at:', this.workerPath);
    }
  }

  /**
   * Compress images in parallel using worker threads
   * @param jobs Array of compression jobs
   * @param onProgress Optional callback for progress updates
   * @returns Promise resolving to array of results
   */
  async compressInParallel(
    jobs: CompressionJob[],
    onProgress?: (completed: number, total: number, result: CompressionResult, iteration?: number) => void
  ): Promise<CompressionResult[]> {
    const results: CompressionResult[] = [];
    const total = jobs.length;
    let completed = 0;

    logger.info('Starting parallel compression', {
      totalJobs: total,
      poolSize: this.poolSize,
    });

    // Process jobs in chunks to avoid overwhelming the system
    const chunkSize = this.poolSize;
    for (let i = 0; i < jobs.length; i += chunkSize) {
      const chunk = jobs.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        chunk.map((job, index) =>
          this.runWorker(job, (iteration) => {
            // Send iteration updates for in-progress jobs
            if (onProgress) {
              const tempResult: CompressionResult = {
                originalName: path.basename(job.inputPath),
                originalSize: 0,
                compressedSize: 0,
                compressionRatio: 0,
                outputPath: '',
                success: true,
              };
              onProgress(completed + index, total, tempResult, iteration);
            }
          })
        )
      );

      for (const result of chunkResults) {
        results.push(result);
        completed++;

        if (onProgress) {
          onProgress(completed, total, result);
        }

        logger.debug('Compression job completed', {
          file: result.originalName,
          success: result.success,
          completed,
          total,
        });
      }
    }

    logger.info('Parallel compression completed', {
      totalJobs: total,
      successCount: results.filter((r) => r.success).length,
      failureCount: results.filter((r) => !r.success).length,
    });

    return results;
  }

  /**
   * Run a single worker for a compression job
   * @param job Compression job data
   * @param onIteration Optional callback for iteration updates
   * @returns Promise resolving to compression result
   */
  private runWorker(
    job: CompressionJob,
    onIteration?: (iteration: number) => void
  ): Promise<CompressionResult> {
    return new Promise((resolve) => {
      const WORKER_TIMEOUT = 60000; // 60 seconds timeout per image
      let timeoutId: NodeJS.Timeout;
      let isResolved = false;

      const worker = new Worker(this.workerPath, {
        workerData: job,
      });

      // Set timeout to prevent hung workers
      timeoutId = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          logger.error('Worker timeout', { job, timeout: WORKER_TIMEOUT });
          worker.terminate();
          resolve({
            success: false,
            originalName: path.basename(job.inputPath),
            originalSize: 0,
            compressedSize: 0,
            compressionRatio: 0,
            outputPath: '',
            error: 'Compression timeout - file may be too large or corrupted',
          });
        }
      }, WORKER_TIMEOUT);

      worker.on('message', (message: any) => {
        // Handle different message types
        if (message.type === 'iteration') {
          // Iteration progress update
          if (onIteration) {
            onIteration(message.iteration);
          }
        } else if (message.type === 'result') {
          // Final result
          if (!isResolved) {
            isResolved = true;
            clearTimeout(timeoutId);
            worker.terminate();
            resolve(message.result);
          }
        } else {
          // Legacy format (direct result object)
          if (!isResolved) {
            isResolved = true;
            clearTimeout(timeoutId);
            worker.terminate();
            resolve(message);
          }
        }
      });

      worker.on('error', (error) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          logger.error('Worker error', { error: error.message, job });
          worker.terminate();
          resolve({
            success: false,
            originalName: path.basename(job.inputPath),
            originalSize: 0,
            compressedSize: 0,
            compressionRatio: 0,
            outputPath: '',
            error: error.message,
          });
        }
      });

      worker.on('exit', (code) => {
        if (code !== 0 && !isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          logger.warn('Worker exited with non-zero code', { code, job });
          resolve({
            success: false,
            originalName: path.basename(job.inputPath),
            originalSize: 0,
            compressedSize: 0,
            compressionRatio: 0,
            outputPath: '',
            error: `Worker crashed with exit code ${code}`,
          });
        }
      });
    });
  }
}

// Export singleton instance
export const workerPool = new WorkerPool();
