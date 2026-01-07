import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

interface CompressionOptions {
  mode: 'quality' | 'targetPercent' | 'targetAbsolute';
  format: 'lossy' | 'lossless';
  quality?: number;
  targetPercent?: number;
  targetSize?: number;
  targetSizeUnit?: 'KB' | 'MB';
  pngCompressionLevel?: number;
  removeMetadata?: boolean;
}

export interface CompressionResult {
  originalName: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  outputPath: string;
  success: boolean;
  error?: string;
  iterations?: number;
  targetAchieved?: boolean;
}

/**
 * Generates a unique output path by appending _1, _2, etc. if file already exists
 */
function getUniqueOutputPath(basePath: string): string {
  if (!fs.existsSync(basePath)) {
    return basePath;
  }

  const parsedPath = path.parse(basePath);
  let counter = 1;
  let newPath: string;

  do {
    newPath = path.join(parsedPath.dir, `${parsedPath.name}_${counter}${parsedPath.ext}`);
    counter++;
  } while (fs.existsSync(newPath));

  return newPath;
}

function mapQuality(uiQuality: number): number {
  const quality = Math.max(0, Math.min(100, uiQuality));

  if (quality <= 33) {
    return 60 + (quality / 33) * 15;
  } else if (quality <= 66) {
    return 76 + ((quality - 34) / 32) * 9;
  } else {
    return 86 + ((quality - 67) / 33) * 9;
  }
}

async function compressQualityMode(
  inputPath: string,
  quality: number,
  outputDir: string,
  format: 'lossy' | 'lossless',
  removeMetadata: boolean = false
): Promise<{ outputPath: string; size: number }> {
  const parsedPath = path.parse(inputPath);

  if (format === 'lossy') {
    const baseOutputPath = path.join(outputDir, `${parsedPath.name}_comp.jpg`);
    const outputPath = getUniqueOutputPath(baseOutputPath);
    const sharpQuality = Math.round(mapQuality(quality));

    let pipeline = sharp(inputPath);

    if (removeMetadata) {
      pipeline = pipeline.withMetadata({
        exif: {},
        icc: undefined,
        iptc: undefined,
        xmp: undefined,
      });
    }

    await pipeline.jpeg({ quality: sharpQuality, mozjpeg: true }).toFile(outputPath);

    return { outputPath, size: fs.statSync(outputPath).size };
  } else {
    const baseOutputPath = path.join(outputDir, `${parsedPath.name}_comp.png`);
    const outputPath = getUniqueOutputPath(baseOutputPath);

    let pipeline = sharp(inputPath);

    if (removeMetadata) {
      pipeline = pipeline.withMetadata({
        exif: {},
        icc: undefined,
        iptc: undefined,
        xmp: undefined,
      });
    }

    await pipeline.png({ compressionLevel: quality }).toFile(outputPath);

    return { outputPath, size: fs.statSync(outputPath).size };
  }
}

async function compressTargetPercentMode(
  inputPath: string,
  targetPercent: number,
  outputDir: string,
  onIteration?: (iteration: number) => void,
  removeMetadata: boolean = false
): Promise<{ outputPath: string; size: number; iterations: number; achieved: boolean }> {
  const parsedPath = path.parse(inputPath);
  const baseOutputPath = path.join(outputDir, `${parsedPath.name}_comp.jpg`);
  const outputPath = getUniqueOutputPath(baseOutputPath);
  const originalSize = fs.statSync(inputPath).size;
  const targetSize = Math.round(originalSize * (targetPercent / 100));

  let minQuality = 0;
  let maxQuality = 100;
  let bestSize = 0;
  let iterations = 0;
  const MAX_ITERATIONS = 10;
  const TOLERANCE = 0.05;

  while (iterations < MAX_ITERATIONS) {
    iterations++;
    const testQuality = Math.round((minQuality + maxQuality) / 2);

    if (onIteration) {
      onIteration(iterations);
    }

    const sharpQuality = Math.round(mapQuality(testQuality));
    const tempPath = `${outputPath}.tmp`;

    let pipeline = sharp(inputPath);

    if (removeMetadata) {
      pipeline = pipeline.withMetadata({
        exif: {},
        icc: undefined,
        iptc: undefined,
        xmp: undefined,
      });
    }

    await pipeline.jpeg({ quality: sharpQuality, mozjpeg: true }).toFile(tempPath);

    const compressedSize = fs.statSync(tempPath).size;
    const ratio = compressedSize / targetSize;

    if (ratio >= 1 - TOLERANCE && ratio <= 1 + TOLERANCE) {
      fs.renameSync(tempPath, outputPath);
      return { outputPath, size: compressedSize, iterations, achieved: true };
    }

    if (Math.abs(compressedSize - targetSize) < Math.abs(bestSize - targetSize) || bestSize === 0) {
      bestSize = compressedSize;
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      fs.renameSync(tempPath, outputPath);
    } else {
      fs.unlinkSync(tempPath);
    }

    if (compressedSize > targetSize) {
      maxQuality = testQuality - 1;
    } else {
      minQuality = testQuality + 1;
    }

    if (minQuality > maxQuality) {
      break;
    }
  }

  return { outputPath, size: bestSize, iterations, achieved: false };
}

async function compressTargetAbsoluteMode(
  inputPath: string,
  targetSizeKB: number,
  outputDir: string,
  onIteration?: (iteration: number) => void,
  removeMetadata: boolean = false
): Promise<{ outputPath: string; size: number; iterations: number; achieved: boolean }> {
  const targetSize = targetSizeKB * 1024;
  const parsedPath = path.parse(inputPath);
  const baseOutputPath = path.join(outputDir, `${parsedPath.name}_comp.jpg`);
  const outputPath = getUniqueOutputPath(baseOutputPath);

  let minQuality = 0;
  let maxQuality = 100;
  let bestSize = 0;
  let iterations = 0;
  const MAX_ITERATIONS = 10;
  const TOLERANCE = 0.05;

  while (iterations < MAX_ITERATIONS) {
    iterations++;
    const testQuality = Math.round((minQuality + maxQuality) / 2);

    if (onIteration) {
      onIteration(iterations);
    }

    const sharpQuality = Math.round(mapQuality(testQuality));
    const tempPath = `${outputPath}.tmp`;

    let pipeline = sharp(inputPath);

    if (removeMetadata) {
      pipeline = pipeline.withMetadata({
        exif: {},
        icc: undefined,
        iptc: undefined,
        xmp: undefined,
      });
    }

    await pipeline.jpeg({ quality: sharpQuality, mozjpeg: true }).toFile(tempPath);

    const compressedSize = fs.statSync(tempPath).size;
    const ratio = compressedSize / targetSize;

    if (ratio >= 1 - TOLERANCE && ratio <= 1 + TOLERANCE) {
      fs.renameSync(tempPath, outputPath);
      return { outputPath, size: compressedSize, iterations, achieved: true };
    }

    if (Math.abs(compressedSize - targetSize) < Math.abs(bestSize - targetSize) || bestSize === 0) {
      bestSize = compressedSize;
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      fs.renameSync(tempPath, outputPath);
    } else {
      fs.unlinkSync(tempPath);
    }

    if (compressedSize > targetSize) {
      maxQuality = testQuality - 1;
    } else {
      minQuality = testQuality + 1;
    }

    if (minQuality > maxQuality) {
      break;
    }
  }

  return { outputPath, size: bestSize, iterations, achieved: false };
}

export async function compressImage(
  inputPath: string,
  options: CompressionOptions,
  outputDirectory?: string,
  onIteration?: (iteration: number) => void
): Promise<CompressionResult> {
  try {
    const parsedPath = path.parse(inputPath);
    const targetDir = outputDirectory || parsedPath.dir;
    const originalSize = fs.statSync(inputPath).size;

    let result: { outputPath: string; size: number; iterations?: number; achieved?: boolean };
    const removeMetadata = options.removeMetadata ?? false;

    if (options.format === 'lossless') {
      result = await compressQualityMode(
        inputPath,
        options.pngCompressionLevel || 6,
        targetDir,
        'lossless',
        removeMetadata
      );
    } else {
      if (options.mode === 'quality') {
        result = await compressQualityMode(
          inputPath,
          options.quality || 70,
          targetDir,
          'lossy',
          removeMetadata
        );
      } else if (options.mode === 'targetPercent') {
        result = await compressTargetPercentMode(
          inputPath,
          options.targetPercent || 50,
          targetDir,
          onIteration,
          removeMetadata
        );
      } else if (options.mode === 'targetAbsolute') {
        const targetKB =
          options.targetSizeUnit === 'MB'
            ? (options.targetSize || 1) * 1024
            : options.targetSize || 500;
        result = await compressTargetAbsoluteMode(
          inputPath,
          targetKB,
          targetDir,
          onIteration,
          removeMetadata
        );
      } else {
        throw new Error('Invalid compression mode');
      }
    }

    const compressionRatio = (1 - result.size / originalSize) * 100;

    return {
      originalName: parsedPath.base,
      originalSize,
      compressedSize: result.size,
      compressionRatio,
      outputPath: result.outputPath,
      success: true,
      iterations: result.iterations,
      targetAchieved: result.achieved,
    };
  } catch (error) {
    const parsedPath = path.parse(inputPath);
    return {
      originalName: parsedPath.base,
      originalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      outputPath: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function compressImages(
  inputPaths: string[],
  options: CompressionOptions,
  outputDirectory?: string,
  onProgress?: (
    completed: number,
    total: number,
    result: CompressionResult,
    iteration?: number
  ) => void
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];
  const total = inputPaths.length;

  for (let i = 0; i < inputPaths.length; i++) {
    const inputPath = inputPaths[i];

    const result = await compressImage(
      inputPath,
      options,
      outputDirectory,
      onProgress
        ? (iteration) => {
            // Send iteration progress during compression
            if (onProgress) {
              const tempResult: CompressionResult = {
                originalName: path.parse(inputPath).base,
                originalSize: 0,
                compressedSize: 0,
                compressionRatio: 0,
                outputPath: '',
                success: true,
              };
              onProgress(i, total, tempResult, iteration);
            }
          }
        : undefined
    );

    results.push(result);

    // Send final progress update for this image
    if (onProgress) {
      onProgress(i + 1, total, result);
    }
  }

  return results;
}
