interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const copyErrorDetails = () => {
    const errorDetails = `Error: ${error.name}\nMessage: ${error.message}\nStack: ${error.stack || 'No stack trace available'}`;
    navigator.clipboard.writeText(errorDetails);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="mt-4 text-xl font-semibold text-gray-900 text-center">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm text-gray-600 text-center">
          The application encountered an unexpected error. You can try reloading or copy the error
          details to report the issue.
        </p>

        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <p className="text-xs font-mono text-gray-700 break-all">
            {error.name}: {error.message}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={resetError}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Reload App
          </button>
          <button
            onClick={copyErrorDetails}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            Copy Error
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">
          If this problem persists, please report it on GitHub
        </p>
      </div>
    </div>
  );
}

export default ErrorFallback;
