import { useImageStore } from '../store/useImageStore';

export function CompressionSlider() {
  const quality = useImageStore((state) => state.quality);
  const setQuality = useImageStore((state) => state.setQuality);

  const getQualityLabel = (value: number) => {
    if (value <= 33) return 'Low';
    if (value <= 66) return 'Medium';
    return 'High';
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">
          Compression Quality
        </label>
        <span className="text-sm font-semibold text-primary">
          {getQualityLabel(quality)} ({quality}%)
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={quality}
        onChange={(e) => setQuality(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Smaller file</span>
        <span>Better quality</span>
      </div>
    </div>
  );
}
