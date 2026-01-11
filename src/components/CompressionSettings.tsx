import { CompressionFormatToggle } from './CompressionFormatToggle';
import { FormatWarning } from './FormatWarning';
import { CompressionModeSelector } from './CompressionModeSelector';
import PresetSelector from './PresetSelector';
import { CompressionSlider } from './CompressionSlider';
import { TargetSizeInput } from './TargetSizeInput';
import { PngCompressionLevelSelector } from './PngCompressionLevelSelector';
import { MetadataRemovalToggle } from './MetadataRemovalToggle';
import { OutputDirectorySelector } from './OutputDirectorySelector';

export function CompressionSettings() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
                <CompressionFormatToggle />
                <FormatWarning />
            </div>

            <CompressionModeSelector />

            <PresetSelector />

            <div>
                <CompressionSlider />
                <TargetSizeInput />
                <PngCompressionLevelSelector />
            </div>

            <MetadataRemovalToggle />
            <OutputDirectorySelector />
        </div>
    );
}
