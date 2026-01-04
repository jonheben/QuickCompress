import { COMPRESSION_PRESETS, PresetKey } from '../config/compressionPresets';

interface PresetSelectorProps {
  selectedPreset: PresetKey;
  onPresetChange: (preset: PresetKey) => void;
}

function PresetSelector({ selectedPreset, onPresetChange }: PresetSelectorProps) {
  const presets: PresetKey[] = ['webOptimized', 'highQuality', 'smallFile', 'custom'];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Quality Preset
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {presets.map((presetKey) => {
          const preset = COMPRESSION_PRESETS[presetKey];
          const isSelected = selectedPreset === presetKey;

          return (
            <button
              key={presetKey}
              onClick={() => onPresetChange(presetKey)}
              className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
              title={preset.description}
            >
              <div className="font-medium text-sm">{preset.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{preset.quality}%</div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {COMPRESSION_PRESETS[selectedPreset].description}
      </p>
    </div>
  );
}

export default PresetSelector;
