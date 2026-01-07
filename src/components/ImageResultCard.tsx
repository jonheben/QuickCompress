import { CheckCircle2, XCircle } from 'lucide-react';
import { CompressionResult } from '../types';
import { useEffect, useState } from 'react';

interface ImageResultCardProps {
  result: CompressionResult;
  onClick: () => void;
}

export function ImageResultCard({ result, onClick }: ImageResultCardProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadThumbnail() {
      if (!result.success) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await window.electron.loadImage(result.outputPath);
        if (response.success && response.dataUrl) {
          setThumbnailUrl(response.dataUrl);
        }
      } catch (error) {
        console.error('Failed to load thumbnail:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadThumbnail();
  }, [result.outputPath, result.success]);

  // Calculate percentage of original size directly from file sizes
  // This is more reliable than using compressionRatio which may be stored differently
  const percentOfOriginal = Math.round((result.compressedSize / result.originalSize) * 100);
  const compressedSizeMB = (result.compressedSize / (1024 * 1024)).toFixed(2);
  const compressedSizeKB = (result.compressedSize / 1024).toFixed(1);
  const displaySize = result.compressedSize >= 1024 * 1024
    ? `${compressedSizeMB} MB`
    : `${compressedSizeKB} KB`;

  return (
    <div
      onClick={result.success ? onClick : undefined}
      className={`
        relative overflow-hidden rounded border bg-tech-surface
        transition-all duration-200
        ${result.success
          ? 'border-tech-border cursor-pointer hover:border-tech-orange'
          : 'border-tech-orange'
        }
      `}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-tech-bg flex items-center justify-center">
        {isLoading ? (
          <div className="text-sm font-sans text-tech-grey">Loading...</div>
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={result.originalName}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-sm font-sans text-tech-grey">
            {result.success ? 'No preview' : 'Failed'}
          </div>
        )}

        {/* File size badge (top-right) */}
        {result.success && (
          <div className="absolute top-2 right-2 bg-tech-bg/90 backdrop-blur-sm text-tech-white rounded px-3 py-2 border border-tech-border">
            <div className="text-sm font-mono font-medium leading-none">{displaySize}</div>
          </div>
        )}

        {/* Error badge */}
        {!result.success && (
          <div className="absolute top-2 right-2 bg-tech-orange text-white rounded-full p-2">
            <XCircle className="w-5 h-5" />
          </div>
        )}

        {/* Success indicator (bottom-left) */}
        {result.success && (
          <div className="absolute bottom-2 left-2 bg-tech-surface/90 rounded-full p-1 border border-tech-border">
            <CheckCircle2 className="w-4 h-4 text-tech-green" />
          </div>
        )}
      </div>

      {/* Filename */}
      <div className="p-3 border-t border-tech-border">
        <p className="text-sm font-mono text-tech-white truncate" title={result.originalName}>
          {result.originalName}
        </p>
        {result.error && (
          <p className="text-xs font-sans text-tech-grey mt-1 truncate" title={result.error}>
            {result.error}
          </p>
        )}
      </div>
    </div>
  );
}
