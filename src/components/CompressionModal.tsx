interface CompressionModalProps {
  progress?: {
    completed: number;
    total: number;
    fileName?: string;
    iteration?: number;
    maxIterations?: number;
  };
}

export function CompressionModal({ progress }: CompressionModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
      {/* Blurred backdrop - prevents all clicks */}
      <div className="absolute inset-0 bg-tech-bg/90 backdrop-blur-md" />

      {/* Modal content */}
      <div className="relative z-10 bg-tech-surface border-2 border-tech-orange rounded-lg p-12 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Large spinning wheel */}
          <div className="animate-spin rounded-full h-24 w-24 border-[6px] border-tech-border border-t-tech-orange" />

          {/* Status text */}
          <div className="text-center">
            <h3 className="text-2xl font-sans font-bold text-tech-white mb-3">
              Compressing your files...
            </h3>

            {progress && (
              <>
                <p className="text-xl font-sans text-tech-white mb-2">
                  <span className="font-mono text-tech-orange font-bold">{progress.completed}</span>
                  {' of '}
                  <span className="font-mono font-bold">{progress.total}</span>
                  {' images'}
                </p>

                {progress.fileName && (
                  <p className="text-sm font-sans text-tech-grey mb-2 truncate max-w-xs">
                    {progress.fileName}
                  </p>
                )}

                {progress.iteration && (
                  <p className="text-sm font-sans text-tech-orange">
                    Optimizing... attempt {progress.iteration}/{progress.maxIterations}
                  </p>
                )}
              </>
            )}

            {!progress && (
              <p className="text-lg font-sans text-tech-grey">
                Please wait...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
