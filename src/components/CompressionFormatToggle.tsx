import { useImageStore } from '../store/useImageStore';

export function CompressionFormatToggle() {
  const format = useImageStore((state) => state.compressionFormat);
  const setFormat = useImageStore((state) => state.setCompressionFormat);

  const formats = [
    {
      id: 'lossy',
      label: 'Lossy (JPG)',
      description: 'Smaller files, slight quality loss',
    },
    {
      id: 'lossless',
      label: 'Lossless (PNG)',
      description: 'Larger files, no quality loss',
    },
  ] as const;

  return (
    <div className="mb-8">
      <label className="block text-xs font-grotesk font-semibold uppercase tracking-widest text-tech-text-secondary mb-3">
        Compression_Format
      </label>
      <div className="grid grid-cols-2 gap-3">
        {formats.map((f) => (
          <button
            key={f.id}
            onClick={() => setFormat(f.id)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-none text-center transition-all duration-200
              ${format === f.id
                ? 'border-2 border-tech-orange bg-tech-orange/5'
                : 'bg-tech-surface border border-tech-border hover:border-tech-text-secondary'
              }
            `}
          >
            <span className={`text-sm font-grotesk font-bold uppercase mb-1 ${format === f.id ? 'text-tech-orange' : 'text-tech-text'}`}>
              {f.label}
            </span>
            <span className={`text-xs font-mono ${format === f.id ? 'text-tech-text-secondary' : 'text-tech-text-muted'}`}>
              {f.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
