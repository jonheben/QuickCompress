import path from 'path';
import fs from 'fs';

export interface SequenceDetectionResult {
    hasSequence: boolean;
    prefix: string;
    separator: string;
    number: string;
    extension: string;
}

export interface OutputPathOptions {
    strategy: 'subfolder' | 'suffix' | 'custom';
    subfolderName?: string;
    suffix?: string;
    customPath?: string;
}

/**
 * Detects if a filename contains a numbered sequence (e.g., photo_001.jpg, IMG001.png)
 * Supports formats: _001, -001, 001, (1), etc.
 */
export function detectNumberedSequence(filename: string): SequenceDetectionResult {
    const parsedPath = path.parse(filename);
    const nameWithoutExt = parsedPath.name;
    const extension = parsedPath.ext;

    // Regex to match numbered sequences at the end of the filename
    // Matches: _001, -001, 001, (1), etc.
    const sequencePattern = /^(.+?)([_-]?)(\d{1,5})$/;
    const parenthesesPattern = /^(.+?)\s*\((\d+)\)$/;

    // Try standard separator patterns first (_001, -001, 001)
    const standardMatch = nameWithoutExt.match(sequencePattern);
    if (standardMatch) {
        return {
            hasSequence: true,
            prefix: standardMatch[1],
            separator: standardMatch[2] || '',
            number: standardMatch[3],
            extension,
        };
    }

    // Try parentheses pattern (1), (2), etc.
    const parenthesesMatch = nameWithoutExt.match(parenthesesPattern);
    if (parenthesesMatch) {
        return {
            hasSequence: true,
            prefix: parenthesesMatch[1].trim(),
            separator: ' ',
            number: `(${parenthesesMatch[2]})`,
            extension,
        };
    }

    // No sequence detected
    return {
        hasSequence: false,
        prefix: nameWithoutExt,
        separator: '',
        number: '',
        extension,
    };
}

/**
 * Checks if a filename already has a compression suffix (e.g., _comp, _comp_2)
 */
export function hasCompSuffix(filename: string, suffix: string = '_comp'): boolean {
    const parsedPath = path.parse(filename);
    const nameWithoutExt = parsedPath.name;

    // Escape special regex characters in the suffix
    const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Check for exact suffix or numbered variants (_comp, _comp_2, _comp_3, etc.)
    const pattern = new RegExp(`${escapedSuffix}(_\\d+)?$`);
    return pattern.test(nameWithoutExt);
}

/**
 * Inserts a suffix before the numbered sequence in a filename
 * Example: photo_001.jpg + "_comp" -> photo_comp_001.jpg
 */
export function insertSuffixBeforeNumber(
    filename: string,
    suffix: string
): string {
    const detection = detectNumberedSequence(filename);

    if (!detection.hasSequence) {
        // No sequence, just append suffix before extension
        const parsed = path.parse(filename);
        return `${parsed.name}${suffix}${parsed.ext}`;
    }

    // Has sequence: insert suffix before the number
    const { prefix, separator, number, extension } = detection;
    return `${prefix}${suffix}${separator}${number}${extension}`;
}

/**
 * Adds suffix to filename, handling duplicate suffix prevention
 * If file already has the suffix, adds numbering instead (_comp_1, _comp_2)
 */
export function addSuffixToFilename(
    filename: string,
    suffix: string = '_comp',
    preventDuplicates: boolean = true
): string {
    // Check if already has suffix
    if (preventDuplicates && hasCompSuffix(filename, suffix)) {
        // File already has the suffix, so use numbering instead
        // Don't add the suffix again, just add _1, _2, etc.
        // This is handled by getUniqueOutputPath later
        return filename;
    }

    // Check for numbered sequence
    return insertSuffixBeforeNumber(filename, suffix);
}

/**
 * Generates unique output path by appending _1, _2, etc. if file already exists
 */
export function getUniqueOutputPath(basePath: string): string {
    if (!fs.existsSync(basePath)) {
        return basePath;
    }

    const parsedPath = path.parse(basePath);
    const dir = parsedPath.dir;
    const ext = parsedPath.ext;
    const name = parsedPath.name;

    let counter = 1;
    let newPath = basePath;

    while (fs.existsSync(newPath)) {
        newPath = path.join(dir, `${name}_${counter}${ext}`);
        counter++;
    }

    return newPath;
}

/**
 * Main function to generate output path based on strategy
 */
export function generateOutputPath(
    inputPath: string,
    outputDir: string,
    options: OutputPathOptions
): string {
    const parsedInput = path.parse(inputPath);
    const originalFilename = parsedInput.base;

    switch (options.strategy) {
        case 'subfolder': {
            // Create subfolder in the same directory as the source file
            const subfolderName = options.subfolderName || 'compress';
            const subfolderPath = path.join(outputDir, subfolderName);

            // Ensure subfolder exists
            if (!fs.existsSync(subfolderPath)) {
                fs.mkdirSync(subfolderPath, { recursive: true });
            }

            // Keep original filename (no suffix needed)
            const outputPath = path.join(subfolderPath, originalFilename);
            return getUniqueOutputPath(outputPath);
        }

        case 'suffix': {
            // Add suffix to filename in the same directory
            const suffix = options.suffix || '_comp';
            const newFilename = addSuffixToFilename(originalFilename, suffix, true);
            const outputPath = path.join(outputDir, newFilename);
            return getUniqueOutputPath(outputPath);
        }

        case 'custom': {
            // Use custom output directory
            const customDir = options.customPath || outputDir;

            // Ensure custom directory exists
            if (!fs.existsSync(customDir)) {
                fs.mkdirSync(customDir, { recursive: true });
            }

            // Apply suffix if specified, otherwise keep original filename
            let finalFilename = originalFilename;
            if (options.suffix) {
                finalFilename = addSuffixToFilename(originalFilename, options.suffix, true);
            }

            const outputPath = path.join(customDir, finalFilename);
            return getUniqueOutputPath(outputPath);
        }

        default:
            // Fallback to suffix strategy
            const suffix = options.suffix || '_comp';
            const newFilename = addSuffixToFilename(originalFilename, suffix, true);
            const outputPath = path.join(outputDir, newFilename);
            return getUniqueOutputPath(outputPath);
    }
}
