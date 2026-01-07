import { useImageStore } from '../store/useImageStore';

export function PngCompressionLevelSelector() {
  const format = useImageStore((state) => state.compressionFormat);
  const level = useImageStore((state) => state.pngCompressionLevel);
  const setLevel = useImageStore((state) => state.setPngCompressionLevel);

  // Only show for lossless format
  if (format !== 'lossless') {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-sans text-tech-white">
          PNG Compression Level
        </label>
        <span className="text-sm font-mono text-tech-white">
          Level {level}
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="9"
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
        className="w-full h-0.5 bg-tech-border rounded appearance-none cursor-pointer slider"
      />

      <div className="flex justify-between text-xs text-tech-grey mt-1 font-sans">
        <span>Faster, larger files (0)</span>
        <span>Slower, smaller files (9)</span>
      </div>
      <p className="text-xs font-sans text-tech-grey mt-1">
        Higher levels take longer but produce smaller files without quality loss
      </p>
    </div>
  );
}
