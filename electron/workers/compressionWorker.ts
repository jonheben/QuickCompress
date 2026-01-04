import { parentPort, workerData } from 'worker_threads';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

interface WorkerData {
  inputPath: string;
  quality: number;
  outputDirectory?: string;
}

interface WorkerResult {
  success: boolean;
  originalName: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  outputPath: string;
  error?: string;
}

/**
 * Map UI quality (0-100) to Sharp quality (60-95)
 * This provides better quality range for users
 */
function mapQuality(uiQuality: number): number {
  // Ensure quality is within bounds
  const quality = Math.max(0, Math.min(100, uiQuality));

  // Map 0-100 to 60-95 with non-linear curve
  // Low quality (0-33): 60-75
  // Medium quality (34-66): 76-85
  // High quality (67-100): 86-95
  if (quality <= 33) {
    return 60 + (quality / 33) * 15;
  } else if (quality <= 66) {
    return 76 + ((quality - 34) / 32) * 9;
  } else {
    return 86 + ((quality - 67) / 33) * 9;
  }
}

async function compressImage(data: WorkerData): Promise<WorkerResult> {
  try {
    const { inputPath, quality, outputDirectory } = data;

    // Parse input path
    const parsedPath = path.parse(inputPath);

    // Determine output path
    const outputDir = outputDirectory || parsedPath.dir;
    const outputPath = path.join(outputDir, `${parsedPath.name}_comp.jpg`);

    // Get original file size
    const originalSize = fs.statSync(inputPath).size;

    // Map quality from UI range (0-100) to Sharp range (60-95)
    const sharpQuality = Math.round(mapQuality(quality));

    // Compress image
    await sharp(inputPath)
      .jpeg({
        quality: sharpQuality,
        mozjpeg: true, // Use mozjpeg for better compression
      })
      .toFile(outputPath);

    // Get compressed file size
    const compressedSize = fs.statSync(outputPath).size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    return {
      success: true,
      originalName: parsedPath.base,
      originalSize,
      compressedSize,
      compressionRatio,
      outputPath,
    };
  } catch (error) {
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
  compressImage(workerData as WorkerData)
    .then((result) => {
      parentPort!.postMessage(result);
    })
    .catch((error) => {
      parentPort!.postMessage({
        success: false,
        originalName: path.basename((workerData as WorkerData).inputPath),
        originalSize: 0,
        compressedSize: 0,
        compressionRatio: 0,
        outputPath: '',
        error: error instanceof Error ? error.message : 'Worker error',
      });
    });
}
