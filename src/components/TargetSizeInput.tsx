import { useImageStore } from '../store/useImageStore';

export function TargetSizeInput() {
  const mode = useImageStore((state) => state.compressionMode);
  const format = useImageStore((state) => state.compressionFormat);
  const targetSize = useImageStore((state) => state.targetSize);
  const targetSizeUnit = useImageStore((state) => state.targetSizeUnit);
  const setTargetSize = useImageStore((state) => state.setTargetSize);
  const setTargetSizeUnit = useImageStore((state) => state.setTargetSizeUnit);

  // Only show for targetAbsolute mode and lossy format
  if (mode !== 'targetAbsolute' || format === 'lossless') {
    return null;
  }

  return (
    <div className="mb-5">
      <label className="block text-sm font-sans text-tech-white mb-2">
        Target File Size
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          min="1"
          value={targetSize}
          onChange={(e) => setTargetSize(Number(e.target.value))}
          className="flex-1 px-3 py-1.5 bg-tech-bg border border-tech-border rounded text-tech-white font-mono text-sm focus:outline-none focus:border-tech-orange transition-colors"
          placeholder="Enter size"
        />
        <select
          value={targetSizeUnit}
          onChange={(e) => setTargetSizeUnit(e.target.value as 'KB' | 'MB')}
          className="px-3 py-1.5 bg-tech-bg border border-tech-border rounded text-tech-white font-sans text-sm focus:outline-none focus:border-tech-orange transition-colors"
        >
          <option value="KB">KB</option>
          <option value="MB">MB</option>
        </select>
      </div>
      <p className="text-[10px] text-tech-grey/70 mt-2">
        Compression will iterate to achieve this target size. Note: specific size makes the compression slightly slower.
      </p>
    </div>
  );
}
