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
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <label className="text-xs font-grotesk font-semibold uppercase tracking-widest text-tech-text-secondary">
          PNG_Compression_Level
        </label>
        <span className="text-2xl font-mono font-semibold text-tech-orange">
          {level}
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="9"
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
        className="slider mb-4"
      />

      <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-tech-text-muted">
        <span>FAST</span>
        <span>SLOW</span>
      </div>
      <p className="text-xs font-mono text-tech-text-muted mt-3">
        Higher levels take longer but produce smaller files without quality loss
      </p>
    </div>
  );
}
