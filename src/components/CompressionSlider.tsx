import { useImageStore } from '../store/useImageStore';

export function CompressionSlider() {
  const mode = useImageStore((state) => state.compressionMode);
  const format = useImageStore((state) => state.compressionFormat);
  const quality = useImageStore((state) => state.quality);
  const targetPercent = useImageStore((state) => state.targetPercent);
  const setQuality = useImageStore((state) => state.setQuality);
  const setTargetPercent = useImageStore((state) => state.setTargetPercent);

  // Hide slider for lossless or targetAbsolute mode
  if (format === 'lossless' || mode === 'targetAbsolute') {
    return null;
  }

  const isQualityMode = mode === 'quality';
  const value = isQualityMode ? quality : targetPercent;
  const setValue = isQualityMode ? setQuality : setTargetPercent;

  const getLabel = (val: number) => {
    if (isQualityMode) {
      if (val <= 33) return 'Low';
      if (val <= 66) return 'Medium';
      return 'High';
    } else {
      if (val <= 25) return 'Tiny';
      if (val <= 50) return 'Small';
      if (val <= 75) return 'Medium';
      return 'Large';
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-sans text-tech-white">
          {isQualityMode ? 'Compression Quality' : 'Target Size'}
        </label>
        <span className="text-sm font-sans text-tech-white">
          {getLabel(value)} ({value}{isQualityMode ? '%' : '% of original'})
        </span>
      </div>

      <input
        type="range"
        min={isQualityMode ? 0 : 1}
        max="100"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-0.5 bg-tech-border rounded appearance-none cursor-pointer slider"
      />

      <div className="flex justify-between text-xs text-tech-grey mt-1 font-sans">
        {isQualityMode ? (
          <>
            <span>Smaller file</span>
            <span>Better quality</span>
          </>
        ) : (
          <>
            <span>More compression</span>
            <span>Less compression</span>
          </>
        )}
      </div>
    </div>
  );
}
