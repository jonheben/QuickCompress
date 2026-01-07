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

    console.log('[ExportButton] Starting compression, setting isProcessing=true');
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
        console.log('[ExportButton] Compression successful, setting results');
        setResults(response.results);
      } else {
        setError(response.error || 'Compression failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to compress images';
      setError(errorMessage);
    } finally {
      console.log('[ExportButton] Compression done, setting isProcessing=false');
      setProcessing(false);
    }
  };

  return (
    <button
      onClick={handleCompress}
      disabled={images.length === 0 || isProcessing}
      className={`
        w-full mt-6 py-3 px-6 rounded font-semibold font-sans
        transition-colors duration-200
        ${
          images.length === 0 || isProcessing
            ? 'bg-tech-surface text-tech-grey cursor-not-allowed border border-tech-border'
            : 'bg-tech-orange text-white hover:bg-[#E64500]'
        }
      `}
    >
      {isProcessing ? 'Compressing...' : `Compress ${images.length} Image${images.length !== 1 ? 's' : ''}`}
    </button>
  );
}
