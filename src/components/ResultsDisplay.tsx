import { useImageStore } from '../store/useImageStore';
import { formatFileSize } from '../utils/formatters';

export function ResultsDisplay() {
  const results = useImageStore((state) => state.results);
  const reset = useImageStore((state) => state.reset);

  if (results.length === 0) {
    return null;
  }

  const successfulResults = results.filter((r) => r.success);
  const failedResults = results.filter((r) => !r.success);

  const totalOriginalSize = successfulResults.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressedSize = successfulResults.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalSaved = totalOriginalSize - totalCompressedSize;
  const totalRatio = totalOriginalSize > 0 ? (totalSaved / totalOriginalSize) * 100 : 0;

  const handleOpenFolder = async () => {
    if (successfulResults.length > 0) {
      await window.electron.openFolder(successfulResults[0].outputPath);
    }
  };

  return (
    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-800">
          Compression Complete!
        </h3>
        <button
          onClick={reset}
          className="text-sm text-green-700 hover:text-green-900 font-medium"
        >
          Compress More Images
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded p-3">
          <p className="text-xs text-gray-600 mb-1">Original Size</p>
          <p className="text-lg font-bold text-gray-800">
            {formatFileSize(totalOriginalSize)}
          </p>
        </div>
        <div className="bg-white rounded p-3">
          <p className="text-xs text-gray-600 mb-1">Compressed Size</p>
          <p className="text-lg font-bold text-gray-800">
            {formatFileSize(totalCompressedSize)}
          </p>
        </div>
        <div className="bg-white rounded p-3">
          <p className="text-xs text-gray-600 mb-1">Space Saved</p>
          <p className="text-lg font-bold text-green-600">
            {totalRatio.toFixed(1)}%
          </p>
        </div>
      </div>

      {successfulResults.length > 0 && (
        <button
          onClick={handleOpenFolder}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Open Folder
        </button>
      )}

      {failedResults.length > 0 && (
        <div className="mt-3 text-sm text-red-700">
          <p className="font-medium">Failed to compress {failedResults.length} file(s):</p>
          {failedResults.map((result, index) => (
            <p key={index} className="text-xs">
              {result.originalName}: {result.error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
