import { Worker } from 'worker_threads';
import os from 'os';
import path from 'path';
import { logger } from '../utils/logger';

interface CompressionJob {
  inputPath: string;
  quality: number;
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

    logger.info('Worker pool initialized', {
      poolSize: this.poolSize,
      cpuCount: os.cpus().length,
    });
  }

  /**
   * Compress images in parallel using worker threads
   * @param jobs Array of compression jobs
   * @param onProgress Optional callback for progress updates
   * @returns Promise resolving to array of results
   */
  async compressInParallel(
    jobs: CompressionJob[],
    onProgress?: (completed: number, total: number, result: CompressionResult) => void
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
      const chunkResults = await Promise.all(chunk.map((job) => this.runWorker(job)));

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
   * @returns Promise resolving to compression result
   */
  private runWorker(job: CompressionJob): Promise<CompressionResult> {
    return new Promise((resolve) => {
      const worker = new Worker(this.workerPath, {
        workerData: job,
      });

      worker.on('message', (result: CompressionResult) => {
        worker.terminate();
        resolve(result);
      });

      worker.on('error', (error) => {
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
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          logger.warn('Worker exited with non-zero code', { code, job });
        }
      });
    });
  }
}

// Export singleton instance
export const workerPool = new WorkerPool();
