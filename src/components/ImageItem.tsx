import { ImageFile } from '../types';
import { formatFileSize } from '../utils/formatters';
import { useImageStore } from '../store/useImageStore';

interface ImageItemProps {
  image: ImageFile;
}

export function ImageItem({ image }: ImageItemProps) {
  const removeImage = useImageStore((state) => state.removeImage);

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
      <button
        onClick={() => removeImage(image.id)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
        title="Remove image"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <img
        src={image.preview}
        alt={image.name}
        className="w-full h-24 object-cover rounded mb-2"
      />

      <p className="text-sm font-medium text-gray-700 truncate" title={image.name}>
        {image.name}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {formatFileSize(image.size)}
      </p>
    </div>
  );
}
