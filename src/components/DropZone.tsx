import { useRef, useState, useEffect } from 'react';
import { useImageStore } from '../store/useImageStore';
import { createThumbnail } from '../utils/formatters';
import { ImageFile } from '../types';

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [scanProgress, setScanProgress] = useState<{ count: number; folderName: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addImages = useImageStore((state) => state.addImages);
  const updateImagePreview = useImageStore((state) => state.updateImagePreview);

  // Handle scan progress updates
  useEffect(() => {
    const cleanup = window.electron.onScanProgress((data) => {
      if (data.done) {
        // Small delay before hiding to let user see final count
        setTimeout(() => setScanProgress(null), 500);
      } else {
        setScanProgress({ count: data.count, folderName: data.folderName });
      }
    });
    return cleanup;
  }, []);

  // Handle clipboard paste (Ctrl+V)
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageItems: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            imageItems.push(file);
          }
        }
      }

      if (imageItems.length > 0) {
        const fileList = new DataTransfer();
        imageItems.forEach((file) => fileList.items.add(file));
        handleFiles(fileList.files);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      return file.type === 'image/jpeg' || file.type === 'image/png';
    });

    if (validFiles.length === 0) {
      alert('Please select only JPG or PNG images.');
      return;
    }

    // Add files immediately with placeholder preview for instant feedback
    const imageFiles: ImageFile[] = validFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      path: (file as File & { path?: string }).path || '', // Electron provides file.path
      size: file.size,
      preview: '', // Empty preview initially - will load in background
    }));

    addImages(imageFiles);

    // Generate thumbnails in background (non-blocking)
    imageFiles.forEach(async (imageFile, index) => {
      try {
        const preview = await createThumbnail(validFiles[index]);
        updateImagePreview(imageFile.id, preview);
      } catch (error) {
        // Thumbnail creation failed, image will be added without preview
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (!items) {
      handleFiles(e.dataTransfer.files);
      return;
    }

    // Check if any item is a directory
    let hasDirectory = false;
    let folderPath: string | null = null;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry?.();
        if (entry?.isDirectory) {
          hasDirectory = true;
          // Get the folder path from the first file in the drop
          const file = item.getAsFile();
          if (file && (file as File & { path?: string }).path) {
            const filePath = (file as File & { path?: string }).path || '';
            // Extract directory path (remove filename)
            folderPath = filePath;
          }
          break;
        }
      }
    }

    if (hasDirectory && folderPath) {
      await handleFolderDrop(folderPath);
    } else {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFolderDrop = async (folderPath: string) => {
    try {
      setIsDragging(true); // Show loading state

      const response = await window.electron.scanFolder(folderPath);

      if (!response.success || !response.imagePaths || response.imagePaths.length === 0) {
        alert(response.error || 'No images found in folder');
        setIsDragging(false);
        return;
      }

      // Create ImageFile objects immediately with placeholder previews
      const imageFiles: ImageFile[] = response.imagePaths.map((path) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: path.split(/[\\/]/).pop() || 'image.jpg',
        path,
        size: 0, // Will be updated when preview loads
        preview: '', // Empty preview initially
      }));

      // Add images immediately for instant feedback
      addImages(imageFiles);
      setIsDragging(false);

      // Generate previews in background (non-blocking)
      imageFiles.forEach(async (imageFile) => {
        try {
          const imageResponse = await window.electron.loadImage(imageFile.path);
          if (!imageResponse.success || !imageResponse.dataUrl) {
            return;
          }

          // Convert data URL to blob for thumbnail creation
          const blob = await fetch(imageResponse.dataUrl).then((r) => r.blob());
          const file = new File([blob], imageFile.name, { type: blob.type });

          const preview = await createThumbnail(file);
          updateImagePreview(imageFile.id, preview);
        } catch (error) {
          // Error processing image, skip this file
        }
      });
    } catch (error) {
      alert('Failed to scan folder. Please try again.');
      setIsDragging(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        border border-tech-border rounded-none p-16 text-center cursor-pointer
        transition-colors duration-150
        ${isDragging || scanProgress
          ? 'border-tech-orange bg-tech-orange/10 border-2'
          : 'hover:border-tech-orange/60 bg-tech-surface'
        }
      `}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Terminal-style prompt */}
        <div className="font-mono text-4xl text-tech-orange font-bold tracking-wider">
          {scanProgress
            ? `> SCANNING_${scanProgress.folderName.toUpperCase().slice(0, 12)}`
            : isDragging
              ? '> SCANNING_'
              : '> READY_FOR_INPUT'}
        </div>

        {/* ASCII-style visual element or scan progress */}
        <div className="font-mono text-tech-text-secondary text-sm">
          {scanProgress ? (
            <div className="space-y-2">
              <div className="animate-pulse">[████████████████████]</div>
              <div className="text-tech-orange font-bold text-lg">
                Found {scanProgress.count} images...
              </div>
            </div>
          ) : isDragging ? (
            <div className="animate-pulse">[████████████████████]</div>
          ) : (
            <>
              <div>┌─────────────────────────┐</div>
              <div>│  DROP_FILES_HERE        │</div>
              <div>│  .PNG // .JPEG          │</div>
              <div>└─────────────────────────┘</div>
            </>
          )}
        </div>

        <div className="mt-2">
          <p className="text-xs font-grotesk uppercase tracking-widest text-tech-text-secondary">
            {scanProgress
              ? `Scanning ${scanProgress.folderName}...`
              : isDragging
                ? 'Processing'
                : 'Supports PNG and JPEG'}
          </p>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
