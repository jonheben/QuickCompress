import { DropZone } from './components/DropZone';
import { ImageList } from './components/ImageList';
import { CompressionSlider } from './components/CompressionSlider';
import { ExportButton } from './components/ExportButton';
import { ProgressIndicator } from './components/ProgressIndicator';
import { ResultsDisplay } from './components/ResultsDisplay';
import PresetSelector from './components/PresetSelector';
import { useImageStore } from './store/useImageStore';
import { useState, useEffect } from 'react';

function App() {
  const images = useImageStore((state) => state.images);
  const isProcessing = useImageStore((state) => state.isProcessing);
  const results = useImageStore((state) => state.results);
  const selectedPreset = useImageStore((state) => state.selectedPreset);
  const setPreset = useImageStore((state) => state.setPreset);

  const [compressionProgress, setCompressionProgress] = useState<{
    completed: number;
    total: number;
    fileName: string;
  } | null>(null);

  useEffect(() => {
    // Set up progress listener
    const cleanup = window.electron.onCompressionProgress((data) => {
      setCompressionProgress({
        completed: data.completed,
        total: data.total,
        fileName: data.fileName,
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Custom Title Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between drag-region">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-800">QuickCompress</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.close()}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 no-drag"
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

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QuickCompress</h1>
          <p className="text-gray-600">Compress your images without losing quality</p>
        </header>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {results.length === 0 ? (
            <>
              <DropZone />
              <ImageList />

              {images.length > 0 && (
                <>
                  <PresetSelector selectedPreset={selectedPreset} onPresetChange={setPreset} />
                  <CompressionSlider />
                  {isProcessing ? (
                    <ProgressIndicator progress={compressionProgress} />
                  ) : (
                    <ExportButton />
                  )}
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
