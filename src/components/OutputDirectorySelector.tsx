import { FolderOpen, X } from 'lucide-react';
import { useImageStore } from '../store/useImageStore';

export function OutputDirectorySelector() {
  const outputDirectory = useImageStore((state) => state.outputDirectory);
  const setOutputDirectory = useImageStore((state) => state.setOutputDirectory);

  const handleSelectDirectory = async () => {
    try {
      const result = await window.electron.selectOutputDirectory();

      if (result.success && result.path) {
        setOutputDirectory(result.path);
      }
    } catch (error) {
      console.error('Failed to select output directory:', error);
    }
  };

  const handleClearDirectory = () => {
    setOutputDirectory(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-sans text-tech-white mb-2">
        Output Directory
      </label>

      {outputDirectory ? (
        <div className="flex items-center gap-2 p-3 bg-tech-surface border border-tech-border rounded">
          <FolderOpen className="w-4 h-4 text-tech-white flex-shrink-0" />
          <span className="text-sm font-mono text-tech-white flex-1 truncate" title={outputDirectory}>
            {outputDirectory}
          </span>
          <button
            onClick={handleClearDirectory}
            className="p-1 hover:bg-tech-bg rounded transition-colors"
            title="Use default location"
          >
            <X className="w-4 h-4 text-tech-grey hover:text-tech-white" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleSelectDirectory}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-tech-white bg-transparent rounded hover:border-tech-grey transition-colors"
        >
          <FolderOpen className="w-5 h-5 text-tech-white" />
          <span className="text-sm font-sans text-tech-white">
            Select Custom Folder (default: next to originals)
          </span>
        </button>
      )}

      <p className="mt-2 text-xs font-sans text-tech-grey">
        {outputDirectory
          ? 'Compressed images will be saved to this folder'
          : 'No folder selected - compressed copies will be saved next to original files'}
      </p>
    </div>
  );
}
