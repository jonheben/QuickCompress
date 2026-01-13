import { Trash2, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { useImageStore } from '../store/useImageStore';
import { useState } from 'react';

export function DeleteOriginalsToggle() {
    const deleteOriginals = useImageStore((state) => state.deleteOriginals);
    const setDeleteOriginals = useImageStore((state) => state.setDeleteOriginals);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full">
            {/* Collapsible Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between mb-3 group"
            >
                <label className="block text-xs font-grotesk font-semibold uppercase tracking-widest text-tech-red cursor-pointer">
                    ⚠️ Danger_Zone
                </label>
                <div className="text-tech-red transition-transform">
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                </div>
            </button>

            {/* Collapsible Content */}
            {isExpanded && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                        onClick={() => setDeleteOriginals(!deleteOriginals)}
                        className={`w-full px-5 py-4 rounded-none border transition-all ${deleteOriginals
                                ? 'border-tech-red bg-tech-red/10'
                                : 'border-tech-border bg-tech-surface hover:border-tech-red/50'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Trash2 className={`w-5 h-5 ${deleteOriginals ? 'text-tech-red' : 'text-tech-text-muted'}`} />
                                <div className="text-left">
                                    <p className={`text-sm font-grotesk font-bold uppercase ${deleteOriginals ? 'text-tech-red' : 'text-tech-text'
                                        }`}>
                                        Move Originals to Recycle Bin
                                    </p>
                                    <p className="text-xs font-mono text-tech-text-muted mt-1">
                                        {deleteOriginals
                                            ? 'Originals will be moved to recycle bin after compression'
                                            : 'Keep original files after compression'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {deleteOriginals && (
                                    <AlertTriangle className="w-5 h-5 text-tech-red animate-pulse" />
                                )}
                                <div
                                    className={`w-12 h-6 rounded-full transition-colors ${deleteOriginals ? 'bg-tech-red' : 'bg-tech-border'
                                        }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${deleteOriginals ? 'translate-x-6' : 'translate-x-0.5'
                                            } mt-0.5`}
                                    />
                                </div>
                            </div>
                        </div>
                    </button>

                    {deleteOriginals && (
                        <div className="mt-3 px-4 py-3 rounded-none border border-tech-red/50 bg-tech-red/5">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-tech-red flex-shrink-0 mt-0.5" />
                                <p className="text-xs font-mono text-tech-red">
                                    WARNING: Original files will be moved to the Recycle Bin. You can restore them if needed.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
