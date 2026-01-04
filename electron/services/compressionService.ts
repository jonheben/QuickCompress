import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export interface CompressionResult {
  originalName: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  outputPath: string;
  success: boolean;
  error?: string;
}

/**
 * Maps UI quality (0-100) to Sharp quality (60-95)
 * Lower values compress more but reduce quality
 */
function mapQuality(uiQuality: number): number {
  if (uiQuality <= 33) {
    // Low: 60-75
    return 60 + (uiQuality / 33) * 15;
  } else if (uiQuality <= 66) {
    // Medium: 76-85
    return 76 + ((uiQuality - 34) / 32) * 9;
  } else {
    // High: 86-95
    return 86 + ((uiQuality - 67) / 33) * 9;
  }
}

/**
 * Compresses a single image using Sharp
 */
export async function compressImage(
  inputPath: string,
  quality: number
): Promise<CompressionResult> {
  try {
    const parsedPath = path.parse(inputPath);
    const outputPath = path.join(
      parsedPath.dir,
      `${parsedPath.name}_comp.jpg`
    );

    // Get original file size
    const originalSize = fs.statSync(inputPath).size;

    // Map quality from UI scale to Sharp scale
    const sharpQuality = Math.round(mapQuality(quality));

    // Compress the image
    await sharp(inputPath)
      .jpeg({
        quality: sharpQuality,
        mozjpeg: true  // Use mozjpeg for better compression
      })
      .toFile(outputPath);

    // Get compressed file size
    const compressedSize = fs.statSync(outputPath).size;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100);

    return {
      originalName: parsedPath.base,
      originalSize,
      compressedSize,
      compressionRatio,
      outputPath,
      success: true,
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

/**
 * Compresses multiple images
 */
export async function compressImages(
  inputPaths: string[],
  quality: number
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];

  for (const inputPath of inputPaths) {
    const result = await compressImage(inputPath, quality);
    results.push(result);
  }

  return results;
}
