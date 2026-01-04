export function ProgressIndicator() {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="text-gray-600 font-medium">Compressing images...</span>
    </div>
  );
}
