import { useState } from 'react';
import { useImageStore } from '../store/useImageStore';
import { formatFileSize } from '../utils/formatters';
import { ImageResultCard } from './ImageResultCard';
import { ImageComparisonModal } from './ImageComparisonModal';

export function ResultsDisplay() {
  const results = useImageStore((state) => state.results);
  const reset = useImageStore((state) => state.reset);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (results.length === 0) {
    return null;
  }

  const successfulResults = results.filter((r) => r.success);
  const failedResults = results.filter((r) => !r.success);

  const totalOriginalSize = successfulResults.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressedSize = successfulResults.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalSaved = totalOriginalSize - totalCompressedSize;
  const totalRatio = totalOriginalSize > 0 ? (totalSaved / totalOriginalSize) * 100 : 0;

  const handleOpenFolder = async () => {
    if (successfulResults.length > 0) {
      await window.electron.openFolder(successfulResults[0].outputPath);
    }
  };

  const handleCardClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  return (
    <>
      <div className="mt-6 bg-tech-surface border border-tech-border rounded p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-sans font-semibold text-tech-white">
            Compression Complete!
          </h3>
          <button
            onClick={reset}
            className="text-sm font-sans text-tech-grey hover:text-tech-white font-medium transition-colors"
          >
            Compress More Images
          </button>
        </div>

        {/* Overall Stats */}
        <div className="bg-tech-bg rounded p-4 mb-4 border border-tech-border">
          <p className="text-sm font-sans text-tech-white mb-2">
            <span className="font-mono">{results.length}</span> image{results.length !== 1 ? 's' : ''} compressed:{' '}
            <span className="font-mono text-tech-white">
              {formatFileSize(totalOriginalSize)} → {formatFileSize(totalCompressedSize)}
            </span>
            {' '}
            <span className="font-mono font-bold text-tech-green">
              ({totalRatio.toFixed(1)}% saved)
            </span>
          </p>
          <p className="text-xs font-sans text-tech-grey">
            Total space saved: <span className="font-mono">{formatFileSize(totalSaved)}</span>
          </p>
        </div>

        {/* Image Grid */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 mb-4">
            {results.map((result, index) => (
              <ImageResultCard
                key={index}
                result={result}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
        )}

        {successfulResults.length > 0 && (
          <button
            onClick={handleOpenFolder}
            className="w-full bg-tech-orange hover:bg-[#E64500] text-white font-sans font-semibold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Open Folder
          </button>
        )}

        {failedResults.length > 0 && (
          <div className="mt-3 text-sm text-tech-orange">
            <p className="font-sans font-medium">Failed to compress <span className="font-mono">{failedResults.length}</span> file(s):</p>
            {failedResults.map((result, index) => (
              <p key={index} className="text-xs font-sans text-tech-grey">
                <span className="font-mono">{result.originalName}</span>: {result.error}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      {selectedImageIndex !== null && (
        <ImageComparisonModal
          results={results}
          currentIndex={selectedImageIndex}
          onClose={handleCloseModal}
          onNavigate={setSelectedImageIndex}
        />
      )}
    </>
  );
}
