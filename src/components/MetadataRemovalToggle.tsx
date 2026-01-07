import { useImageStore } from '../store/useImageStore';

export function MetadataRemovalToggle() {
  const removeMetadata = useImageStore((state) => state.removeMetadata);
  const setRemoveMetadata = useImageStore((state) => state.setRemoveMetadata);

  return (
    <div className="mt-6 p-4 bg-tech-bg border border-tech-border rounded">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={removeMetadata}
          onChange={(e) => setRemoveMetadata(e.target.checked)}
          className="w-5 h-5 rounded border-tech-border bg-tech-surface text-tech-orange focus:ring-2 focus:ring-tech-orange focus:ring-offset-0 cursor-pointer"
        />
        <div className="flex-1">
          <span className="text-tech-white font-sans font-medium">
            Remove metadata (EXIF, GPS, etc.)
          </span>
          <p className="text-sm text-tech-grey mt-1">
            Strip location, camera info, and other metadata from your images
          </p>
        </div>
      </label>
    </div>
  );
}
