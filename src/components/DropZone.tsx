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
      const isValid = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isValid) {
        console.warn(`Skipping invalid file: ${file.name}`);
      }
      return isValid;
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
            path: (file as any).path || '', // Electron provides file.path
            size: file.size,
            preview,
          };
        } catch (error) {
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
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
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
        transition-colors duration-200
        ${
          isDragging
            ? 'border-primary bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-white'
        }
      `}
    >
      <div className="flex flex-col items-center gap-4">
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <div>
          <p className="text-lg font-medium text-gray-700">
            Drop images here or click to browse
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Supports JPG and PNG files
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
