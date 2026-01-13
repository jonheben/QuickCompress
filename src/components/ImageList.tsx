import { useImageStore } from '../store/useImageStore';
import { ImageItem } from './ImageItem';
import { Trash2 } from 'lucide-react';

export function ImageList() {
  const images = useImageStore((state) => state.images);
  const clearImages = useImageStore((state) => state.clearImages);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-tech-border">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-grotesk font-bold uppercase tracking-widest text-tech-text">
          Selected_Images // <span className="font-mono text-tech-orange">{images.length}</span>
        </h2>
        <button
          onClick={clearImages}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-tech-text-muted hover:text-tech-red hover:bg-tech-red/10 rounded-none border border-transparent hover:border-tech-red/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((image) => (
          <ImageItem key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
}
