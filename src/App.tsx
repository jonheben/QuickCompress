import { DropZone } from './components/DropZone';
import { ImageList } from './components/ImageList';
import { ExportButton } from './components/ExportButton';
import { CompressionModal } from './components/CompressionModal';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ErrorNotification } from './components/ErrorNotification';
import { CompressionSettings } from './components/CompressionSettings';
import { useImageStore } from './store/useImageStore';
import { useState, useEffect } from 'react';

function App() {
  const images = useImageStore((state) => state.images);
  const isProcessing = useImageStore((state) => state.isProcessing);
  const results = useImageStore((state) => state.results);

  const [compressionProgress, setCompressionProgress] = useState<{
    completed: number;
    total: number;
    fileName: string;
    iteration?: number;
    maxIterations?: number;
  } | null>(null);

  useEffect(() => {
    // Set up progress listener
    const cleanup = window.electron.onCompressionProgress((data) => {
      setCompressionProgress((prev) => {
        // If this is a completion event, update everything including filename
        if (data.isCompletion) {
          return {
            completed: data.completed,
            total: data.total,
            fileName: data.fileName,
            iteration: 0, // Reset iteration on new file
            maxIterations: data.maxIterations,
          };
        }

        // For iteration updates, only update the iteration count
        // Keep the existing filename to prevent flickering
        return {
          ...prev,
          completed: data.completed,
          total: data.total,
          iteration: data.iteration,
          maxIterations: data.maxIterations,
        };
      });
    });

    // Cleanup on unmount
    return cleanup;
  }, []);

  // Reset progress when processing ends
  useEffect(() => {
    if (!isProcessing) {
      setCompressionProgress(null);
    }
  }, [isProcessing]);

  return (
    <div className="min-h-screen bg-tech-bg flex flex-col">
      <ErrorNotification />

      {/* Compression Modal - Full screen overlay */}
      {isProcessing && <CompressionModal progress={compressionProgress || undefined} />}

      {/* Custom Title Bar */}
      <div className="bg-tech-bg border-b border-tech-border px-4 py-2 flex items-center justify-between drag-region">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-tech-white">QuickCompress</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.close()}
            className="w-8 h-8 flex items-center justify-center hover:bg-tech-surface rounded text-tech-grey hover:text-tech-white no-drag transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-6">
        {/* Main Content */}
        <div className="bg-tech-surface rounded border border-tech-border p-6">
          {results.length === 0 ? (
            <>
              <DropZone />

              {images.length > 0 && (
                <>
                  <CompressionSettings />
                  <ExportButton />
                  <ImageList />
                </>
              )}
            </>
          ) : (
            <ResultsDisplay />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
