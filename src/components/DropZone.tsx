import { useRef, useState } from 'react';
import { useImageStore } from '../store/useImageStore';
import { createThumbnail } from '../utils/formatters';
import { ImageFile } from '../types';

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addImages = useImageStore((state) => state.addImages);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      return file.type === 'image/jpeg' || file.type === 'image/png';
    });

    if (validFiles.length === 0) {
      alert('Please select only JPG or PNG images.');
      return;
    }

    // Process files and create thumbnails
    const imageFiles: ImageFile[] = await Promise.all(
      validFiles.map(async (file) => {
        try {
          const preview = await createThumbnail(file);
          return {
            id: `${Date.now()}-${Math.random()}`,
            name: file.name,
            path: (file as File & { path?: string }).path || '', // Electron provides file.path
            size: file.size,
            preview,
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error creating thumbnail for ${file.name}:`, error);
          return null;
        }
      })
    );

    const validImageFiles = imageFiles.filter((img): img is ImageFile => img !== null);
    addImages(validImageFiles);
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

      // Create ImageFile objects for all found images
      const imageFiles: ImageFile[] = await Promise.all(
        response.imagePaths.map(async (path) => {
          try {
            // Load image as blob to create thumbnail
            const imageResponse = await window.electron.loadImage(path);
            if (!imageResponse.success || !imageResponse.dataUrl) {
              return null;
            }

            // Convert data URL to blob for thumbnail creation
            const blob = await fetch(imageResponse.dataUrl).then((r) => r.blob());
            const file = new File([blob], path.split(/[\\/]/).pop() || 'image.jpg', {
              type: blob.type,
            });

            const preview = await createThumbnail(file);
            return {
              id: `${Date.now()}-${Math.random()}`,
              name: path.split(/[\\/]/).pop() || 'image.jpg',
              path,
              size: blob.size,
              preview,
            };
          } catch (error) {
            console.error(`Error processing ${path}:`, error);
            return null;
          }
        })
      );

      const validImageFiles = imageFiles.filter((img): img is ImageFile => img !== null);

      if (validImageFiles.length === 0) {
        alert('Failed to process images from folder');
      } else {
        addImages(validImageFiles);
      }
    } catch (error) {
      console.error('Folder drop failed:', error);
      alert('Failed to scan folder. Please try again.');
    } finally {
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
        border rounded p-12 text-center cursor-pointer
        transition-colors duration-200
        ${
          isDragging
            ? 'border-tech-orange bg-tech-bg'
            : 'border-tech-border hover:border-tech-grey bg-tech-surface'
        }
      `}
    >
      <div className="flex flex-col items-center gap-4">
        <svg
          className="w-16 h-16 text-tech-grey"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div>
          <p className="text-lg font-sans text-tech-white">
            {isDragging ? 'Scanning folder...' : 'Drop PNG or JPEG files here'}
          </p>
          <p className="text-sm text-tech-grey mt-1">
            {isDragging ? 'Please wait...' : 'or paste from clipboard'}
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
