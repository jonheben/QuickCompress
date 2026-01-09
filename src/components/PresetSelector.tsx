import { COMPRESSION_PRESETS, PresetKey } from '../config/compressionPresets';
import { useImageStore } from '../store/useImageStore';

// Removed interface
function PresetSelector() {
  const selectedPreset = useImageStore((state) => state.selectedPreset);
  const setPreset = useImageStore((state) => state.setPreset);
  const format = useImageStore((state) => state.compressionFormat);
  const mode = useImageStore((state) => state.compressionMode);

  // Hide presets for lossless, targetPercent, or targetAbsolute modes
  // Only show presets for quality-based compression
  if (format === 'lossless' || mode === 'targetPercent' || mode === 'targetAbsolute') {
    return null;
  }

  // Don't show custom button, only 3 real presets
  const visiblePresets: PresetKey[] = ['highQuality', 'balanced', 'maxCompression'];

  return (
    <div className="mb-5">
      <label className="block text-sm font-sans text-tech-white mb-2">
        Quality Preset
      </label>
      <div className="flex gap-2">
        {visiblePresets.map((presetKey) => {
          const preset = COMPRESSION_PRESETS[presetKey];
          const isSelected = selectedPreset === presetKey;

          return (
            <button
              key={presetKey}
              onClick={() => setPreset(presetKey)}
              className={`flex-1 px-3 py-1.5 rounded border font-sans text-sm transition-all ${isSelected
                ? 'border-tech-orange bg-tech-orange text-white'
                : 'border-tech-border bg-transparent text-tech-white hover:border-tech-grey'
                }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs font-sans text-tech-grey mt-1">
        {selectedPreset === 'custom'
          ? 'Custom settings'
          : COMPRESSION_PRESETS[selectedPreset].description}
      </p>
    </div>
  );
}

export default PresetSelector;
