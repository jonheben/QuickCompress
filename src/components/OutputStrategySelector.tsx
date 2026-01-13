import { FolderOpen, FileText, FolderPlus } from 'lucide-react';
import { useImageStore } from '../store/useImageStore';
import { useState } from 'react';

export function OutputStrategySelector() {
    const outputStrategy = useImageStore((state) => state.outputStrategy);
    const subfolderName = useImageStore((state) => state.subfolderName);
    const outputSuffix = useImageStore((state) => state.outputSuffix);
    const outputDirectory = useImageStore((state) => state.outputDirectory);
    const images = useImageStore((state) => state.images);

    // Get example filename from first selected image, or use placeholder
    const exampleFilename = images.length > 0
        ? images[0].name.replace(/\.[^.]+$/, '') // Remove extension
        : 'image';
    const exampleExt = images.length > 0
        ? images[0].name.split('.').pop() || 'jpg'
        : 'jpg';

    const setOutputStrategy = useImageStore((state) => state.setOutputStrategy);
    const setSubfolderName = useImageStore((state) => state.setSubfolderName);
    const setOutputSuffix = useImageStore((state) => state.setOutputSuffix);
    const setOutputDirectory = useImageStore((state) => state.setOutputDirectory);

    const [tempSubfolderName, setTempSubfolderName] = useState(subfolderName);
    const [tempSuffix, setTempSuffix] = useState(outputSuffix);

    const handleSubfolderChange = (value: string) => {
        setTempSubfolderName(value);
        if (value.trim()) {
            setSubfolderName(value.trim());
        }
    };

    const handleSuffixChange = (value: string) => {
        setTempSuffix(value);
        if (value.trim()) {
            setOutputSuffix(value.trim());
        }
    };

    return (
        <div className="w-full">
            <label className="block text-xs font-grotesk font-semibold uppercase tracking-widest text-tech-text-secondary mb-3">
                Output_Strategy
            </label>

            {/* Strategy Selection Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                    onClick={() => setOutputStrategy('subfolder')}
                    className={`px-4 py-3 rounded-none border transition-colors ${outputStrategy === 'subfolder'
                        ? 'border-tech-orange bg-tech-orange/10 text-tech-orange'
                        : 'border-tech-border bg-tech-surface text-tech-text hover:border-tech-orange/50'
                        }`}
                >
                    <div className="flex flex-col items-center gap-2">
                        <FolderPlus className="w-5 h-5" />
                        <span className="text-xs font-grotesk font-bold uppercase">Subfolder</span>
                    </div>
                </button>

                <button
                    onClick={() => setOutputStrategy('suffix')}
                    className={`px-4 py-3 rounded-none border transition-colors ${outputStrategy === 'suffix'
                        ? 'border-tech-orange bg-tech-orange/10 text-tech-orange'
                        : 'border-tech-border bg-tech-surface text-tech-text hover:border-tech-orange/50'
                        }`}
                >
                    <div className="flex flex-col items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-xs font-grotesk font-bold uppercase">Suffix</span>
                    </div>
                </button>

                <button
                    onClick={() => setOutputStrategy('custom')}
                    className={`px-4 py-3 rounded-none border transition-colors ${outputStrategy === 'custom'
                        ? 'border-tech-orange bg-tech-orange/10 text-tech-orange'
                        : 'border-tech-border bg-tech-surface text-tech-text hover:border-tech-orange/50'
                        }`}
                >
                    <div className="flex flex-col items-center gap-2">
                        <FolderOpen className="w-5 h-5" />
                        <span className="text-xs font-grotesk font-bold uppercase">Custom</span>
                    </div>
                </button>
            </div>

            {/* Conditional Input Fields */}
            {outputStrategy === 'subfolder' && (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={tempSubfolderName}
                        onChange={(e) => handleSubfolderChange(e.target.value)}
                        placeholder="compress"
                        className="w-full px-4 py-2 rounded-none border border-tech-border bg-tech-bg text-tech-text font-mono text-sm focus:border-tech-orange focus:outline-none"
                    />
                    <p className="text-xs font-mono text-tech-text-muted">
                        Example: <span className="text-tech-orange">C:\Photos\{tempSubfolderName || 'compress'}\</span>{exampleFilename}.{exampleExt}
                    </p>
                    <p className="text-xs font-mono text-tech-text-muted mt-1">
                        💡 Creates subfolder next to each original image
                    </p>
                </div>
            )}

            {outputStrategy === 'suffix' && (
                <div className="space-y-2">
                    <input
                        type="text"
                        value={tempSuffix}
                        onChange={(e) => handleSuffixChange(e.target.value)}
                        placeholder="_comp"
                        className="w-full px-4 py-2 rounded-none border border-tech-border bg-tech-bg text-tech-text font-mono text-sm focus:border-tech-orange focus:outline-none"
                    />
                    <p className="text-xs font-mono text-tech-text-muted">
                        Example: {exampleFilename}<span className="text-tech-orange">{tempSuffix || '_comp'}</span>.{exampleExt}
                    </p>
                    <p className="text-xs font-mono text-tech-text-muted mt-1">
                        💡 Adds suffix to filename in same folder
                    </p>
                </div>
            )}


            {outputStrategy === 'custom' && (
                <div className="space-y-2">
                    <button
                        onClick={async () => {
                            const result = await window.electron.selectOutputDirectory();
                            if (result.success && result.path) {
                                setOutputDirectory(result.path);
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-none border border-tech-border bg-tech-surface hover:border-tech-orange text-tech-text font-medium transition-colors"
                    >
                        <FolderOpen className="w-5 h-5 text-tech-text" />
                        <span className="text-sm font-grotesk font-bold uppercase">
                            {outputDirectory ? 'Change Folder' : 'Select Folder'}
                        </span>
                    </button>

                    {outputDirectory && (
                        <div className="px-3 py-2 rounded-none border border-tech-border bg-tech-bg/50">
                            <p className="text-xs font-mono text-tech-text-muted break-all">
                                📁 {outputDirectory}
                            </p>
                        </div>
                    )}

                    <p className="text-xs font-mono text-tech-text-muted">
                        💡 All compressed images will be saved to the selected folder
                    </p>
                </div>
            )}
        </div>
    );
}
