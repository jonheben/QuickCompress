import { useImageStore } from '../store/useImageStore';
import { ImageItem } from './ImageItem';

export function ImageList() {
  const images = useImageStore((state) => state.images);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-tech-border">
      <h2 className="text-lg font-sans font-semibold text-tech-white mb-3">
        Selected Images (<span className="font-mono">{images.length}</span>)
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <ImageItem key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
}
