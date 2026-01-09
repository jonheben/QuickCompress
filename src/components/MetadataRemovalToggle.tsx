import { useImageStore } from '../store/useImageStore';

export function MetadataRemovalToggle() {
  const removeMetadata = useImageStore((state) => state.removeMetadata);
  const setRemoveMetadata = useImageStore((state) => state.setRemoveMetadata);

  return (
    <div className="mb-6 p-4 bg-[#141414] rounded-lg border border-tech-border flex items-center justify-between">
      <div>
        <label className="block text-sm font-sans font-semibold text-tech-white mb-1">
          Remove Metadata
        </label>
        <p className="text-xs font-sans text-tech-grey">
          Strip EXIF data for smaller files
        </p>
      </div>

      <button
        onClick={() => setRemoveMetadata(!removeMetadata)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
          ${removeMetadata ? 'bg-tech-orange' : 'bg-[#333333]'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${removeMetadata ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}
