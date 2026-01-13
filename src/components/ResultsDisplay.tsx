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
      <div className="mt-6 bg-tech-surface border border-tech-border rounded-none p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-grotesk font-black uppercase tracking-widest text-tech-text">
            Compression_Complete
          </h3>
          <button
            onClick={reset}
            className="text-sm font-mono text-tech-text-secondary hover:text-tech-text font-medium transition-colors uppercase"
          >
            Compress_More
          </button>
        </div>

        {/* Open Folder Button - Moved to top */}
        {successfulResults.length > 0 && (
          <button
            onClick={handleOpenFolder}
            className="w-full bg-tech-orange/10 border border-tech-orange rounded-none py-3 px-5 hover:bg-tech-orange/20 text-tech-orange font-grotesk font-bold uppercase transition-all flex items-center justify-center gap-2 mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Open Folder
          </button>
        )}

        {/* Overall Stats */}
        <div className="bg-tech-surface-secondary rounded-none p-5 mb-6 border-l-2 border-tech-green">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-grotesk uppercase tracking-widest text-tech-text-secondary">
                Images_Processed
              </p>
              <p className="text-3xl font-mono font-bold text-tech-green">
                {results.length}
              </p>
            </div>
            <div>
              <p className="text-xs font-grotesk uppercase tracking-widest text-tech-text-secondary">
                Space_Saved
              </p>
              <p className="text-3xl font-mono font-bold text-tech-green">
                {totalRatio.toFixed(1)}%
              </p>
              <p className="text-xs font-mono text-tech-text-secondary mt-1">
                {formatFileSize(totalOriginalSize)} {'//'} {formatFileSize(totalCompressedSize)}
              </p>
            </div>
            <div>
              <p className="text-xs font-grotesk uppercase tracking-widest text-tech-text-secondary">
                Total_Saved
              </p>
              <p className="text-3xl font-mono font-bold text-tech-green">
                {formatFileSize(totalSaved)}
              </p>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {results.map((result, index) => (
              <ImageResultCard
                key={index}
                result={result}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
        )}

        {failedResults.length > 0 && (
          <div className="mt-4 text-sm text-tech-red">
            <p className="font-grotesk font-bold uppercase">Failed to compress <span className="font-mono">{failedResults.length}</span> file(s):</p>
            {failedResults.map((result, index) => (
              <p key={index} className="text-xs font-mono text-tech-text-secondary mt-1">
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
