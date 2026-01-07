import { X } from 'lucide-react';
import { useImageStore } from '../store/useImageStore';

export function ErrorNotification() {
  const error = useImageStore((state) => state.error);
  const setError = useImageStore((state) => state.setError);

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
      <div className="bg-tech-surface border-l-4 border-tech-orange p-4 rounded border border-tech-border">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-tech-orange" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-sans font-medium text-tech-white">
              {error}
            </p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-3 flex-shrink-0 hover:bg-tech-bg rounded p-1 transition-colors"
          >
            <X className="h-4 w-4 text-tech-grey hover:text-tech-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
