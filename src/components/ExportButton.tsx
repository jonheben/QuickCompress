import { useImageStore } from '../store/useImageStore';

export function ExportButton() {
  const images = useImageStore((state) => state.images);
  const quality = useImageStore((state) => state.quality);
  const isProcessing = useImageStore((state) => state.isProcessing);
  const setProcessing = useImageStore((state) => state.setProcessing);
  const setResults = useImageStore((state) => state.setResults);

  const handleCompress = async () => {
    if (images.length === 0 || isProcessing) return;

    setProcessing(true);

    try {
      const imagePaths = images.map((img) => img.path);
      const response = await window.electron.compressImages(imagePaths, quality);

      if (response.success) {
        setResults(response.results);
      } else {
        alert(`Error: ${response.error}`);
        setProcessing(false);
      }
    } catch (error) {
      alert('Failed to compress images. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <button
      onClick={handleCompress}
      disabled={images.length === 0 || isProcessing}
      className={`
        w-full mt-6 py-3 px-6 rounded-lg font-semibold text-white
        transition-colors duration-200
        ${
          images.length === 0 || isProcessing
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-primary hover:bg-blue-700'
        }
      `}
    >
      {isProcessing ? 'Compressing...' : `Compress ${images.length} Image${images.length !== 1 ? 's' : ''}`}
    </button>
  );
}
