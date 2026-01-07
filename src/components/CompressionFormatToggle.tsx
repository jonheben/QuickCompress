import { useImageStore } from '../store/useImageStore';

export function CompressionFormatToggle() {
  const format = useImageStore((state) => state.compressionFormat);
  const setFormat = useImageStore((state) => state.setCompressionFormat);

  return (
    <div className="mb-4">
      <label className="block text-sm font-sans text-tech-white mb-2">
        Compression Format
      </label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFormat('lossy')}
          className={`px-4 py-2 rounded border font-sans text-sm transition-all ${
            format === 'lossy'
              ? 'border-tech-orange bg-tech-orange text-white'
              : 'border-tech-border bg-transparent text-tech-white hover:border-tech-grey'
          }`}
        >
          Lossy (JPEG)
        </button>
        <button
          onClick={() => setFormat('lossless')}
          className={`px-4 py-2 rounded border font-sans text-sm transition-all ${
            format === 'lossless'
              ? 'border-tech-orange bg-tech-orange text-white'
              : 'border-tech-border bg-transparent text-tech-white hover:border-tech-grey'
          }`}
        >
          Lossless (PNG)
        </button>
      </div>
      <p className="text-xs font-sans text-tech-grey mt-1">
        {format === 'lossy'
          ? 'Smaller file sizes with minimal quality loss'
          : 'Preserve original quality, larger files'}
      </p>
    </div>
  );
}
