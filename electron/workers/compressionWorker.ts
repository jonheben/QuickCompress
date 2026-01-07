import { parentPort, workerData } from 'worker_threads';
import { compressImage, CompressionResult } from '../services/compressionService';

interface WorkerData {
  inputPath: string;
  options: any;
  outputDirectory?: string;
}

async function processCompression(data: WorkerData): Promise<CompressionResult> {
  try {
    const { inputPath, options, outputDirectory } = data;

    // Send iteration progress updates back to main thread
    const onIteration = (iteration: number) => {
      if (parentPort) {
        parentPort.postMessage({
          type: 'iteration',
          iteration,
          maxIterations: 10,
        });
      }
    };

    // Use the unified compression service
    const result = await compressImage(
      inputPath,
      options,
      outputDirectory,
      onIteration
    );

    return result;
  } catch (error) {
    const path = require('path');
    return {
      success: false,
      originalName: path.basename(data.inputPath),
      originalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      outputPath: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Main worker execution
if (parentPort && workerData) {
  processCompression(workerData as WorkerData)
    .then((result) => {
      parentPort!.postMessage({
        type: 'result',
        result,
      });
    })
    .catch((error) => {
      const path = require('path');
      parentPort!.postMessage({
        type: 'result',
        result: {
          success: false,
          originalName: path.basename((workerData as WorkerData).inputPath),
          originalSize: 0,
          compressedSize: 0,
          compressionRatio: 0,
          outputPath: '',
          error: error instanceof Error ? error.message : 'Worker error',
        },
      });
    });
}
