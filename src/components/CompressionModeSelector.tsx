import { useImageStore } from '../store/useImageStore';
import { CompressionMode } from '../types';

export function CompressionModeSelector() {
  const mode = useImageStore((state) => state.compressionMode);
  const setMode = useImageStore((state) => state.setCompressionMode);
  const format = useImageStore((state) => state.compressionFormat);

  const modes: { value: CompressionMode; label: string; description: string }[] = [
    {
      value: 'quality',
      label: 'Quality Based',
      description: 'Fast, single-pass compression',
    },
    {
      value: 'targetPercent',
      label: 'Target Size %',
      description: 'Compress to percentage of original (accurate, slower)',
    },
    {
      value: 'targetAbsolute',
      label: 'Target File Size',
      description: 'Compress to specific file size',
    },
  ];

  // Hide mode selector when lossless is active
  if (format === 'lossless') return null;

  return (
    <div className="mb-4">
      <label className="block text-sm font-sans text-tech-white mb-2">
        Compression Mode
      </label>
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as CompressionMode)}
        className="w-full px-3 py-2 bg-tech-bg border border-tech-border rounded text-tech-white font-sans text-sm focus:outline-none focus:border-tech-orange transition-colors"
      >
        {modes.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <p className="text-xs font-sans text-tech-grey mt-1">
        {modes.find((m) => m.value === mode)?.description}
      </p>
    </div>
  );
}
