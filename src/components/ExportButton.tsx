import { Zap } from 'lucide-react';
import { useImageStore } from '../store/useImageStore';

export function ExportButton() {
  const images = useImageStore((state) => state.images);
  const outputDirectory = useImageStore((state) => state.outputDirectory);
  const isProcessing = useImageStore((state) => state.isProcessing);
  const setProcessing = useImageStore((state) => state.setProcessing);
  const setResults = useImageStore((state) => state.setResults);
  const setError = useImageStore((state) => state.setError);
  const getCompressionOptions = useImageStore((state) => state.getCompressionOptions);

  const handleCompress = async () => {
    if (images.length === 0 || isProcessing) return;

    const startTime = Date.now();
    setProcessing(true);
    setError(null);

    try {
      const imagePaths = images.map((img) => img.path);

      if (imagePaths.some(path => !path || path.trim() === '')) {
        setError('Invalid image paths detected');
        setProcessing(false);
        return;
      }

      const options = getCompressionOptions();

      const response = await window.electron.compressImages(
        imagePaths,
        options,
        outputDirectory || undefined
      );

      // Ensure modal shows for at least 800ms
      const elapsed = Date.now() - startTime;
      const minDisplayTime = 800;
      if (elapsed < minDisplayTime) {
        await new Promise(resolve => setTimeout(resolve, minDisplayTime - elapsed));
      }

      if (response.success && response.results) {
        setResults(response.results);
      } else {
        setError(response.error || 'Compression failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to compress images';
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button
      onClick={handleCompress}
      disabled={images.length === 0 || isProcessing}
      className={`
        w-full mt-8 py-5 px-6 rounded-none font-grotesk font-black text-sm uppercase tracking-widest
        flex items-center justify-center gap-2
        transition-all duration-150
        border-2
        ${images.length === 0 || isProcessing
          ? 'border-tech-border text-tech-text-muted cursor-not-allowed bg-tech-surface'
          : 'border-tech-orange text-tech-text bg-transparent hover:bg-tech-orange hover:text-black'
        }
      `}
    >
      <span className="font-mono text-xs">
        [ {isProcessing ? 'PROCESSING...' : 'COMPRESS_IMAGES'} ]
      </span>
    </button>
  );
}
