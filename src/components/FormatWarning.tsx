import { useImageStore } from '../store/useImageStore';

export function FormatWarning() {
  const images = useImageStore((state) => state.images);
  const format = useImageStore((state) => state.compressionFormat);

  // Check if any images are JPEG/JPG
  const hasJpegImages = images.some((img) => {
    const ext = img.name.toLowerCase();
    return ext.endsWith('.jpg') || ext.endsWith('.jpeg');
  });

  // Only show warning when lossless mode is selected and there are JPEG images
  if (format !== 'lossless' || !hasJpegImages) {
    return null;
  }

  return (
    <div className="mb-3 px-3 py-2 bg-tech-bg border border-tech-border rounded">
      <p className="text-xs font-sans text-tech-grey">
        Converting JPEG to PNG increases file size because PNG preserves all pixel data losslessly
      </p>
    </div>
  );
}
