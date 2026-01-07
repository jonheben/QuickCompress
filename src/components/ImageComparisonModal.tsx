import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { CompressionResult } from '../types';
import { useImageStore } from '../store/useImageStore';
import { formatFileSize } from '../utils/formatters';

interface ImageComparisonModalProps {
  results: CompressionResult[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ImageComparisonModal({
  results,
  currentIndex,
  onClose,
  onNavigate,
}: ImageComparisonModalProps) {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [zoomLevel, setZoomLevel] = useState(100);
  const originalImagePaths = useImageStore((state) => state.originalImagePaths);

  const currentResult = results[currentIndex];
  const canNavigatePrev = currentIndex > 0;
  const canNavigateNext = currentIndex < results.length - 1;

  // Load images when currentIndex changes
  useEffect(() => {
    async function loadImages() {
      if (!currentResult.success) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setOriginalUrl(null);
      setCompressedUrl(null);

      try {
        // Load original image
        const originalPath = originalImagePaths[currentResult.originalName];
        if (originalPath) {
          const originalResponse = await window.electron.loadImage(originalPath);
          if (originalResponse.success && originalResponse.dataUrl) {
            setOriginalUrl(originalResponse.dataUrl);
          }
        }

        // Load compressed image
        const compressedResponse = await window.electron.loadImage(currentResult.outputPath);
        if (compressedResponse.success && compressedResponse.dataUrl) {
          setCompressedUrl(compressedResponse.dataUrl);
        }
      } catch (error) {
        console.error('Failed to load comparison images:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadImages();
  }, [currentIndex, currentResult, originalImagePaths]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && canNavigatePrev) {
        onNavigate(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && canNavigateNext) {
        onNavigate(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, canNavigatePrev, canNavigateNext, onClose, onNavigate]);

  const [isDragging, setIsDragging] = useState(false);
  const rafRef = React.useRef<number>();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const imageContainer = container.querySelector('.image-container') as HTMLElement;
    if (!imageContainer) return;

    const rect = imageContainer.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't start dragging if clicking on a button or interactive element
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    e.preventDefault();
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      updateSliderPosition(e.clientX);
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(500, prev + 25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(25, prev - 25));
  const handleResetZoom = () => setZoomLevel(100);

  // Mouse wheel zoom and global mouse up
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -Math.sign(e.deltaY) * 25;
        setZoomLevel((prev) => Math.min(500, Math.max(25, prev + delta)));
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const percentSaved = Math.round(((currentResult.originalSize - currentResult.compressedSize) / currentResult.originalSize) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-tech-bg flex flex-col">
      {/* Header - compact to avoid window controls */}
      <div className="bg-tech-surface px-3 py-1.5 flex items-center text-tech-white border-b border-tech-border" style={{ paddingRight: '160px' }}>
        <div className="min-w-0 flex-1 mr-2">
          <h2 className="text-xs font-mono font-semibold truncate">{currentResult.originalName}</h2>
          <p className="text-xs font-sans text-tech-grey">
            <span className="font-mono">{currentIndex + 1}/{results.length}</span>
            {currentResult.success && (
              <span className="ml-2 text-tech-green font-mono font-medium">
                {percentSaved}% saved
              </span>
            )}
          </p>
        </div>

        {/* File Size Labels */}
        <div className="flex items-center gap-3 mr-2 flex-shrink-0 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-tech-orange"></div>
            <span className="font-sans font-medium text-tech-grey">Original: <span className="font-mono text-tech-white">{formatFileSize(currentResult.originalSize)}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-tech-green"></div>
            <span className="font-sans font-medium text-tech-grey">Compressed: <span className="font-mono text-tech-white">{formatFileSize(currentResult.compressedSize)}</span></span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 mr-2 flex-shrink-0">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-tech-bg rounded transition-colors text-tech-white"
            title="Zoom out"
            disabled={zoomLevel <= 25}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs w-12 text-center font-mono font-medium">{zoomLevel}%</span>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-tech-bg rounded transition-colors text-tech-white"
            title="Zoom in"
            disabled={zoomLevel >= 500}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 hover:bg-tech-bg rounded transition-colors text-tech-white"
            title="Reset zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-tech-bg rounded transition-colors flex-shrink-0"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Split Comparison View */}
      <div className="flex-1 bg-tech-bg overflow-auto relative">
        {isLoading ? (
          <div className="flex items-center justify-center text-tech-grey p-20">
            Loading...
          </div>
        ) : (
          <div
            className="w-full h-full overflow-auto flex items-start justify-center p-4 cursor-ew-resize"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div className="relative cursor-ew-resize select-none">
              {/* Image container with zoom transform */}
              <div
                className="image-container relative"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  pointerEvents: 'none',
                }}
              >
                {/* Compressed Image (Background - Full) */}
                {compressedUrl && (
                  <div className="relative">
                    <img
                      src={compressedUrl}
                      alt="Compressed"
                      className="block"
                      style={{
                        maxWidth: '90vw',
                        maxHeight: '80vh',
                      }}
                    />
                  </div>
                )}

                {/* Original Image (Foreground - Clipped by slider) */}
                {originalUrl && compressedUrl && (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    }}
                  >
                    <img
                      src={originalUrl}
                      alt="Original"
                      className="block"
                      style={{
                        maxWidth: '90vw',
                        maxHeight: '80vh',
                      }}
                    />
                  </div>
                )}

                {/* White Slider Line with Pill Badge */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none"
                  style={{
                    left: `${sliderPosition}%`,
                    transform: 'translateX(-50%)',
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Pill Badge showing percentage */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full px-3 py-1 shadow-lg">
                    <span className="font-mono text-xs text-tech-bg font-medium">{Math.round(sliderPosition)}%</span>
                  </div>

                  {/* Circular Draggable Handle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8 w-6 h-6 bg-white rounded-full shadow-xl border-2 border-tech-bg"></div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {results.length > 1 && (
        <div className="bg-tech-surface p-3 flex items-center justify-center gap-4 border-t border-tech-border">
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            disabled={!canNavigatePrev}
            className="p-2 hover:bg-tech-bg rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-tech-white"
            title="Previous (←)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-tech-grey text-sm font-sans">
            Use arrow keys or drag slider to compare
          </span>
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            disabled={!canNavigateNext}
            className="p-2 hover:bg-tech-bg rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-tech-white"
            title="Next (→)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
