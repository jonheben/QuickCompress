import { useImageStore } from '../store/useImageStore';
import { useState, useEffect } from 'react';

export function CompressionSlider() {
  const mode = useImageStore((state) => state.compressionMode);
  const format = useImageStore((state) => state.compressionFormat);
  const quality = useImageStore((state) => state.quality);
  const targetPercent = useImageStore((state) => state.targetPercent);
  const setQuality = useImageStore((state) => state.setQuality);
  const setTargetPercent = useImageStore((state) => state.setTargetPercent);

  // Derived state
  const isQualityMode = mode === 'quality';
  const value = isQualityMode ? quality : targetPercent;
  const setValue = isQualityMode ? setQuality : setTargetPercent;

  // Local state for the input field
  const [inputValue, setInputValue] = useState(value.toString());

  // Sync local state when the actual value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // Hide slider for lossless or targetPercent mode (now handled by TargetSizeInput)
  if (format === 'lossless' || mode === 'targetPercent') {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);

    // Only update the store if it's a valid number within range
    const numVal = parseInt(newVal);
    if (!isNaN(numVal) && newVal !== '') {
      let constrained = numVal;
      if (constrained > 100) constrained = 100;
      const min = isQualityMode ? 0 : 1;
      if (constrained < min) constrained = min;

      setValue(constrained);
    }
  };

  const handleBlur = () => {
    // On blur, reset to the current valid value from store
    // This handles cases where the user left it empty or invalid
    setInputValue(value.toString());
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-baseline mb-3">
        <label className="text-xs font-grotesk font-semibold uppercase tracking-widest text-tech-text-secondary">
          {isQualityMode ? 'Quality_Level' : 'Target_Percentage'}
        </label>
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            min={isQualityMode ? 0 : 1}
            max="100"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-16 bg-transparent text-right text-2xl font-mono font-bold text-tech-orange focus:outline-none border-b border-transparent focus:border-tech-orange transition-colors no-spinners"
          />
          <span className="font-mono text-xs text-tech-text-muted">%</span>
        </div>
      </div>

      <div className="relative h-6 flex items-center mb-4">
        <input
          type="range"
          min={isQualityMode ? 0 : 1}
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full slider focus:outline-none"
        />
      </div>

      <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-tech-text-muted">
        {isQualityMode ? (
          <>
            <span>LOW</span>
            <span>HIGH</span>
          </>
        ) : (
          <>
            <span>SMALLER</span>
            <span>ORIGINAL</span>
          </>
        )}
      </div>

      {!isQualityMode && (
        <p className="text-xs font-mono text-tech-text-muted mt-3 text-center">
          Note: Achieving exact percentage may take longer
        </p>
      )}

      <style>{`
        .no-spinners::-webkit-inner-spin-button,
        .no-spinners::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinners {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
