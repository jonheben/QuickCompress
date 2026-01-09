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

  // Hide slider for lossless or targetAbsolute mode
  if (format === 'lossless' || mode === 'targetAbsolute') {
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
    <div className="mb-6 p-5 bg-[#141414] rounded-lg border border-tech-border">
      <div className="flex justify-between items-start mb-6">
        <label className="text-sm font-sans font-semibold text-tech-white">
          {isQualityMode ? 'Quality Level' : 'Target Percentage'}
        </label>
        <input
          type="number"
          min={isQualityMode ? 0 : 1}
          max="100"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-24 bg-transparent text-right text-3xl font-mono text-tech-orange focus:outline-none border-b border-transparent focus:border-tech-orange transition-colors no-spinners"
        />
      </div>

      <div className="relative h-6 flex items-center">
        {/* Track Background */}
        <div className="absolute w-full h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
          {/* Fill Track handled by input range mostly, but let's just style the input properly */}
        </div>

        <input
          type="range"
          min={isQualityMode ? 0 : 1}
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-1.5 bg-[#2A2A2A] rounded-full appearance-none cursor-pointer slider z-10 focus:outline-none"
          style={{
            backgroundSize: `${value}% 100%`,
            backgroundImage: `linear-gradient(#FF4F00, #FF4F00)` // Fill visualization
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-tech-grey mt-3 font-sans font-medium">
        {isQualityMode ? (
          <>
            <span>Low Quality</span>
            <span>High Quality</span>
          </>
        ) : (
          <>
            <span>Small Size</span>
            <span>Original Size</span>
          </>
        )}
      </div>

      {!isQualityMode && (
        <p className="text-[10px] text-tech-grey/70 mt-2 text-center">
          Note: iterating to achieve exactly the specific % makes it a bit slower.
        </p>
      )}

      <style>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #FF4F00;
          cursor: pointer;
          border: 2px solid #141414;
          box-shadow: 0 0 0 1px #FF4F00;
          transition: transform 0.1s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #FF4F00;
          cursor: pointer;
          border: 2px solid #141414;
          box-shadow: 0 0 0 1px #FF4F00;
        }
        /* Remove default track styles since we use custom bg */
        .slider::-webkit-slider-runnable-track {
            background: transparent; 
        }
        .slider::-moz-range-track {
            background: transparent;
        }
        /* Remove number input spinners */
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
