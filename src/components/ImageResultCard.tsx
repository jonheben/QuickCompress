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
        relative overflow-hidden rounded-none border bg-tech-surface
        transition-all duration-200
        ${result.success
          ? 'border-tech-border cursor-pointer hover:border-tech-orange'
          : 'border-tech-red'
        }
      `}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-tech-surface-secondary flex items-center justify-center border-b border-tech-border">
        {isLoading ? (
          <div className="text-sm font-mono text-tech-text-secondary">Loading...</div>
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={result.originalName}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-sm font-mono text-tech-text-secondary">
            {result.success ? 'No preview' : 'Failed'}
          </div>
        )}

        {/* Error badge */}
        {!result.success && (
          <div className="absolute top-2 right-2 bg-tech-red text-white rounded-none p-2 border border-tech-red">
            <XCircle className="w-5 h-5" />
          </div>
        )}

        {/* Success indicator (top-left) */}
        {result.success && (
          <div className="absolute top-2 left-2 bg-black/90 rounded-none p-1 border border-tech-border">
            <CheckCircle2 className="w-4 h-4 text-tech-green" />
          </div>
        )}

        {/* Data overlay - bottom edge */}
        {result.success && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/90 border-t border-tech-border p-1 flex justify-between items-center">
            <span className="text-[10px] font-mono text-tech-text-secondary">
              {(result.originalSize / 1024 / 1024).toFixed(2)}MB
            </span>
            <span className="text-[10px] font-mono text-tech-orange font-bold">{'//'}</span>
            <span className="text-[10px] font-mono text-tech-green">
              {displaySize}
            </span>
          </div>
        )}
      </div>

      {/* Filename */}
      <div className="p-3">
        <p className="text-sm font-mono text-tech-text truncate" title={result.originalName}>
          {result.originalName}
        </p>
        {result.error && (
          <p className="text-xs font-mono text-tech-text-muted mt-1 truncate" title={result.error}>
            {result.error}
          </p>
        )}
      </div>
    </div>
  );
}
