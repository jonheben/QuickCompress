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
    <div className="mb-6">
      <label className="block text-xs font-grotesk font-semibold uppercase tracking-widest text-tech-text-secondary mb-3">
        Quality_Preset
      </label>
      <div className="flex gap-2">
        {visiblePresets.map((presetKey) => {
          const preset = COMPRESSION_PRESETS[presetKey];
          const isSelected = selectedPreset === presetKey;

          return (
            <button
              key={presetKey}
              onClick={() => setPreset(presetKey)}
              className={`flex-1 px-4 py-2 rounded-none font-grotesk font-bold uppercase text-sm transition-all ${isSelected
                ? 'border border-tech-orange bg-tech-orange/5 text-tech-orange'
                : 'border border-tech-border text-tech-text-secondary hover:border-tech-orange/40'
                }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs font-mono text-tech-text-muted mt-2">
        {selectedPreset === 'custom'
          ? 'Custom settings'
          : COMPRESSION_PRESETS[selectedPreset].description}
      </p>
    </div>
  );
}

export default PresetSelector;
