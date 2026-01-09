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
    <div className="mb-6">
      <label className="block text-sm font-sans text-tech-grey mb-3">
        Compression Format
      </label>
      <div className="grid grid-cols-2 gap-3">
        {formats.map((f) => (
          <button
            key={f.id}
            onClick={() => setFormat(f.id)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-lg border text-center transition-all duration-200
              ${format === f.id
                ? 'border-tech-orange bg-[#1A1A1A] text-tech-white shadow-[0_0_0_1px_rgba(255,79,0,0.3)]'
                : 'border-tech-border bg-tech-bg/50 text-tech-grey hover:border-tech-grey hover:bg-tech-surface'
              }
            `}
          >
            <span className={`text-sm font-semibold mb-1 ${format === f.id ? 'text-tech-white' : 'text-tech-white'}`}>
              {f.label}
            </span>
            <span className="text-xs text-tech-grey">
              {f.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
