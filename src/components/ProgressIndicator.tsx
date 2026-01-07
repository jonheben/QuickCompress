interface ProgressIndicatorProps {
  progress?: {
    completed: number;
    total: number;
    fileName?: string;
    iteration?: number;
    maxIterations?: number;
  };
}

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <div className="mt-6 p-8 bg-tech-bg border border-tech-border rounded">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-tech-border border-t-tech-orange"></div>
        <div className="text-center">
          <span className="text-tech-white font-sans font-medium text-lg">
            {progress
              ? <>Compressing <span className="font-mono">{progress.completed}</span> of <span className="font-mono">{progress.total}</span> images...</>
              : 'Compressing images...'}
          </span>
          {progress && progress.fileName && (
            <p className="text-sm font-sans text-tech-grey mt-2">{progress.fileName}</p>
          )}
          {progress && progress.iteration && (
            <p className="text-sm font-sans text-tech-orange mt-2">
              Optimizing... attempt {progress.iteration}/{progress.maxIterations}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
