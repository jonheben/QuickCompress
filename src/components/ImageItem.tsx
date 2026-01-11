import { ImageFile } from '../types';
import { formatFileSize } from '../utils/formatters';
import { useImageStore } from '../store/useImageStore';

interface ImageItemProps {
  image: ImageFile;
}

export function ImageItem({ image }: ImageItemProps) {
  const removeImage = useImageStore((state) => state.removeImage);

  return (
    <div className="relative bg-tech-surface border border-tech-border rounded-none hover:border-tech-orange transition-all">
      <button
        onClick={() => removeImage(image.id)}
        className="absolute top-2 right-2 bg-tech-surface rounded-none w-6 h-6 flex items-center justify-center border border-tech-border text-tech-text-secondary hover:bg-tech-red hover:border-tech-red hover:text-white transition-colors z-10"
        title="Remove image"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative w-full h-24 bg-tech-surface-secondary border-b border-tech-border">
        <img
          src={image.preview}
          alt={image.name}
          className="w-full h-full object-cover"
        />

        {/* Data overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 border-t border-tech-border p-1">
          <span className="text-[10px] font-mono text-tech-text-secondary">{formatFileSize(image.size)}</span>
        </div>
      </div>

      <div className="p-2">
        <p className="text-xs font-mono text-tech-text truncate" title={image.name}>
          {image.name}
        </p>
      </div>
    </div>
  );
}
