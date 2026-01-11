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
      <div className="bg-tech-surface border-b border-tech-border px-6 py-3 flex items-center justify-between drag-region">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-grotesk font-black uppercase tracking-widest text-tech-text">QuickCompress</h1>
          <span className="text-[10px] font-mono text-tech-text-muted">ENGINE_V.01</span>
        </div>

        <span className="text-[10px] font-mono text-tech-text-muted">CR_2026 // B:13</span>

        <div className="flex gap-2">
          <button
            onClick={() => window.close()}
            className="w-7 h-7 flex items-center justify-center rounded-none border border-transparent hover:bg-tech-red hover:border-tech-red text-tech-text-secondary hover:text-white no-drag transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto px-6 md:px-8 py-8 md:py-10">
        {/* Main Content */}
        <div className="bg-tech-surface rounded-none p-8 md:p-10 border border-tech-border">
          {results.length === 0 ? (
            <>
              <DropZone />

              {images.length > 0 && (
                <>
                  <div className="mt-8">
                    <CompressionSettings />
                  </div>
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
