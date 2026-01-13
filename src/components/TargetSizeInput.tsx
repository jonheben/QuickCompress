import { useState, useEffect, useMemo } from 'react';
import { useImageStore } from '../store/useImageStore';

export function TargetSizeInput() {
  const mode = useImageStore((state) => state.compressionMode);
  const format = useImageStore((state) => state.compressionFormat);
  const targetPercent = useImageStore((state) => state.targetPercent);
  const setTargetPercent = useImageStore((state) => state.setTargetPercent);
  const targetSizeMB = useImageStore((state) => state.targetSizeMB);
  const setTargetSizeMB = useImageStore((state) => state.setTargetSizeMB);
  const images = useImageStore((state) => state.images);

  // Track which unit to display (% or MB)
  const [displayUnit, setDisplayUnit] = useState<'percent' | 'size'>('percent');

  // Local input state for manual typing
  const [inputValue, setInputValue] = useState('');

  // Calculate average size of all images in MB - memoize to prevent recalculation
  const avgSizeMB = useMemo(() => {
    const totalSizeMB = images.reduce((sum, img) => sum + (img.size / 1024 / 1024), 0);
    return images.length > 0 ? totalSizeMB / images.length : 0;
  }, [images]);

  // Sync input value when store values or display unit changes
  useEffect(() => {
    if (displayUnit === 'percent') {
      setInputValue(targetPercent.toString());
    } else {
      setInputValue(targetSizeMB.toFixed(2));
    }
  }, [targetPercent, targetSizeMB, displayUnit]);

  // Only show for targetPercent mode and lossy format
  if (mode !== 'targetPercent' || format === 'lossless') {
    return null;
  }

  // Handle slider change - updates appropriate store value based on unit
  const handleSliderChange = (value: number) => {
    if (displayUnit === 'percent') {
      setTargetPercent(value);
    } else {
      // For MB mode: slider range is 0.2 to 5.0 MB
      const mbValue = 0.2 + (value / 100) * (5.0 - 0.2);
      setTargetSizeMB(mbValue);
    }
  };

  // Handle manual input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);

    const numVal = parseFloat(newVal);
    if (!isNaN(numVal) && newVal !== '') {
      if (displayUnit === 'percent') {
        const constrained = Math.max(1, Math.min(100, numVal));
        setTargetPercent(constrained);
      } else {
        // For MB: accept any positive value, no constraints
        if (numVal > 0) {
          setTargetSizeMB(numVal);
        }
      }
    }
  };

  const handleBlur = () => {
    // On blur, reset to the current valid value
    if (displayUnit === 'percent') {
      setInputValue(targetPercent.toString());
    } else {
      setInputValue(targetSizeMB.toFixed(2));
    }
  };

  // Calculate slider value based on unit
  const sliderValue = displayUnit === 'percent'
    ? targetPercent
    : Math.round(((Math.max(0.2, Math.min(5.0, targetSizeMB)) - 0.2) / (5.0 - 0.2)) * 100);

  // Calculate equivalent value for display
  const equivalentValue = displayUnit === 'percent'
    ? `${((targetPercent / 100) * avgSizeMB).toFixed(2)}MB`
    : `${Math.round((targetSizeMB / avgSizeMB) * 100)}%`;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-baseline mb-3">
        <label className="text-xs font-grotesk font-semibold uppercase tracking-widest text-tech-text-secondary">
          Target_Value
        </label>

        {/* Input with unit toggle */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={displayUnit === 'percent' ? 1 : 0.01}
            max={displayUnit === 'percent' ? 100 : undefined}
            step={displayUnit === 'percent' ? 1 : 0.01}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-20 bg-transparent text-right text-2xl font-mono font-bold text-tech-orange focus:outline-none border-b border-transparent focus:border-tech-orange transition-colors no-spinners"
          />

          {/* Unit toggle buttons */}
          <div className="flex rounded-none border border-tech-border overflow-hidden ml-1">
            <button
              onClick={() => setDisplayUnit('percent')}
              className={`
                px-2 py-1 text-xs font-mono uppercase tracking-wider transition-colors
                ${displayUnit === 'percent'
                  ? 'bg-tech-orange text-black font-bold'
                  : 'bg-tech-surface text-tech-text-secondary hover:bg-tech-surface-secondary'
                }
              `}
            >
              %
            </button>
            <button
              onClick={() => setDisplayUnit('size')}
              className={`
                px-2 py-1 text-xs font-mono uppercase tracking-wider transition-colors border-l border-tech-border
                ${displayUnit === 'size'
                  ? 'bg-tech-orange text-black font-bold'
                  : 'bg-tech-surface text-tech-text-secondary hover:bg-tech-surface-secondary'
                }
              `}
            >
              MB
            </button>
          </div>
        </div>
      </div>

      {/* Slider - always visible, controls percent or MB based on displayUnit */}
      <div className="relative h-6 flex items-center mb-4">
        <input
          type="range"
          min={displayUnit === 'percent' ? 1 : 0}
          max="100"
          value={sliderValue}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full slider focus:outline-none"
        />
      </div>

      <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-tech-text-muted">
        <span>SMALLER</span>
        <span>ORIGINAL</span>
      </div>

      {/* Show contextual information based on selected unit */}
      {images.length > 0 && avgSizeMB > 0 && (
        <p className="text-xs font-mono text-tech-text-muted mt-3 text-center">
          ≈ {equivalentValue} {'//'} Based on avg image size
        </p>
      )}

      <p className="text-xs font-mono text-tech-text-muted mt-2 text-center">
        Note: Exact values may take longer to achieve
      </p>

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
