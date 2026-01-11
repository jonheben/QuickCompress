import { useImageStore } from '../store/useImageStore';

export function MetadataRemovalToggle() {
  const removeMetadata = useImageStore((state) => state.removeMetadata);
  const setRemoveMetadata = useImageStore((state) => state.setRemoveMetadata);

  return (
    <div className="mb-8 p-4 rounded-none bg-tech-surface border border-tech-border flex items-center justify-between">
      <div>
        <label className="block text-xs font-grotesk font-semibold uppercase tracking-widest text-tech-text-secondary mb-1">
          Remove_Metadata
        </label>
        <p className="text-xs font-mono text-tech-text-muted">
          Strip EXIF data
        </p>
      </div>

      <button
        onClick={() => setRemoveMetadata(!removeMetadata)}
        className={`
          px-5 py-2 rounded-none font-mono text-xs uppercase tracking-wider transition-all focus:outline-none border
          ${removeMetadata ? 'bg-tech-orange text-black border-tech-orange font-bold' : 'bg-transparent text-tech-text-secondary border-tech-border hover:border-tech-orange'}
        `}
      >
        [ {removeMetadata ? 'ON' : 'OFF'} ]
      </button>
    </div>
  );
}
