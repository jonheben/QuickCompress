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
      <div className="absolute inset-0 bg-black/90" />

      {/* Modal content - floating on blurred background */}
      <div className="relative z-10 bg-tech-surface rounded-none border-2 border-tech-orange p-8 min-w-[400px]">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Status text */}
          <div className="text-center w-full">
            <h3 className="text-lg font-grotesk font-black uppercase tracking-widest text-tech-text mb-4">
              Compressing_Files
            </h3>

            {progress && (
              <>
                {/* Blocky progress bar */}
                <div className="w-full bg-tech-surface-secondary border border-tech-border h-6 mb-3">
                  <div
                    className="h-full bg-tech-orange transition-all"
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  />
                </div>

                <p className="text-sm font-mono text-tech-text-secondary mb-2">
                  <span className="font-bold text-tech-orange">{progress.completed}</span>
                  {' // '}
                  <span className="font-bold text-tech-text">{progress.total}</span>
                </p>

                {progress.fileName && (
                  <p className="text-xs font-mono text-tech-text-muted mb-2 truncate max-w-xs">
                    {progress.fileName}
                  </p>
                )}

                {progress.iteration && (
                  <p className="text-xs font-mono text-tech-text-muted">
                    Optimizing... iteration {progress.iteration}/{progress.maxIterations}
                  </p>
                )}
              </>
            )}

            {!progress && (
              <p className="text-base font-mono text-tech-text">
                Please wait...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
