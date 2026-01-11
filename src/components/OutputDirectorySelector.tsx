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
      // Failed to select directory, user may have cancelled
    }
  };

  const handleClearDirectory = () => {
    setOutputDirectory(null);
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-grotesk font-semibold uppercase tracking-widest text-tech-text-secondary mb-1">
        Output_Directory
      </label>

      {outputDirectory ? (
        <div className="flex items-center gap-3 p-5 rounded-none bg-tech-surface border border-tech-border">
          <FolderOpen className="w-5 h-5 text-tech-orange flex-shrink-0" />
          <span className="text-sm font-mono text-tech-text-muted flex-1 truncate" title={outputDirectory}>
            {outputDirectory}
          </span>
          <button
            onClick={handleClearDirectory}
            className="px-4 py-2 rounded-none border border-tech-border text-tech-red font-medium hover:bg-tech-red/5 transition-colors"
            title="Use default location"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleSelectDirectory}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-none border border-tech-border bg-tech-surface hover:border-tech-orange text-tech-text font-medium transition-colors"
        >
          <FolderOpen className="w-5 h-5 text-tech-text" />
          <span className="text-sm font-grotesk font-bold uppercase">
            Select Custom Folder
          </span>
        </button>
      )}

      <p className="mt-2 text-xs font-mono text-tech-text-muted">
        {outputDirectory
          ? 'Files will be saved to your custom folder'
          : 'Files will be saved next to originals by default'}
      </p>
    </div>
  );
}
