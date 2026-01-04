interface ProgressIndicatorProps {
  progress?: {
    completed: number;
    total: number;
    fileName?: string;
  };
}

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <div className="text-center">
        <span className="text-gray-700 font-medium">
          {progress
            ? `Compressing ${progress.completed} of ${progress.total} images...`
            : 'Compressing images...'}
        </span>
        {progress && progress.fileName && (
          <p className="text-sm text-gray-500 mt-1">{progress.fileName}</p>
        )}
      </div>
    </div>
  );
}
