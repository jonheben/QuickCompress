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
        <svg className="w-5 h-5 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      value: 'targetPercent',
      label: 'Target %',
      description: '% of original',
      icon: (
        <svg className="w-5 h-5 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      value: 'targetAbsolute',
      label: 'Target Size',
      description: 'Specific size',
      icon: (
        <svg className="w-5 h-5 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ];

  // Hide mode selector when lossless is active
  if (format === 'lossless') return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-sans text-tech-grey mb-3">
        Compression Mode
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {modes.map((m) => {
          const isActive = mode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`
                flex flex-col p-4 rounded-lg border text-left transition-all duration-200 group
                ${isActive
                  ? 'border-tech-orange bg-[#1A1A1A] text-tech-white shadow-[0_0_0_1px_rgba(255,79,0,0.3)]'
                  : 'border-tech-border bg-tech-bg/50 text-tech-grey hover:border-tech-grey hover:bg-tech-surface'
                }
              `}
            >
              <div className={`${isActive ? 'text-tech-orange' : 'text-tech-grey group-hover:text-tech-white'}`}>
                {m.icon}
              </div>
              <span className={`text-sm font-semibold mb-1 ${isActive ? 'text-tech-white' : 'text-tech-white'}`}>
                {m.label}
              </span>
              <span className="text-xs text-tech-grey">
                {m.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
