import { useImageStore } from '../store/useImageStore';
import { CompressionMode } from '../types';

export function CompressionModeSelector() {
  const mode = useImageStore((state) => state.compressionMode);
  const setMode = useImageStore((state) => state.setCompressionMode);
  const format = useImageStore((state) => state.compressionFormat);

  const modes: { value: CompressionMode; label: string; description: string; icon: React.ReactNode }[] = [
    {
      value: 'quality',
      label: 'Quality',
      description: 'Set quality level',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      value: 'targetPercent',
      label: 'Target',
      description: 'Size or percentage',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
  ];

  // Hide mode selector when lossless is active
  if (format === 'lossless') return null;

  return (
    <div className="mb-8">
      <label className="block text-xs font-grotesk font-semibold uppercase tracking-widest text-tech-text-secondary mb-3">
        Compression_Mode
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {modes.map((m) => {
          const isActive = mode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`
                flex items-center gap-3 p-4 rounded-none text-left transition-all duration-200 group
                ${isActive
                  ? 'border-2 border-tech-orange bg-tech-orange/5'
                  : 'bg-tech-surface border border-tech-border hover:border-tech-text-secondary'
                }
              `}
            >
              <div className={`flex-shrink-0 ${isActive ? 'text-tech-orange' : 'text-tech-text-secondary group-hover:text-tech-orange'}`}>
                {m.icon}
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-grotesk font-bold uppercase tracking-wide mb-0.5 ${isActive ? 'text-tech-orange' : 'text-tech-text'}`}>
                  {m.label}
                </span>
                <span className={`text-xs font-mono ${isActive ? 'text-tech-text-secondary' : 'text-tech-text-muted'}`}>
                  {m.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
