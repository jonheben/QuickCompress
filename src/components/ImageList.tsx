import { useImageStore } from '../store/useImageStore';
import { ImageItem } from './ImageItem';

export function ImageList() {
  const images = useImageStore((state) => state.images);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-tech-border">
      <h2 className="text-sm font-grotesk font-bold uppercase tracking-widest text-tech-text mb-3">
        Selected_Images // <span className="font-mono text-tech-orange">{images.length}</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((image) => (
          <ImageItem key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
}
