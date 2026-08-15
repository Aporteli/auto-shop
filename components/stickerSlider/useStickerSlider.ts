import { useEffect, useRef, useState } from 'react';

export function useStickerSlider(itemKey: unknown) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const didDragRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const updateControls = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
    setCanScrollLeft(viewport.scrollLeft > 4);
    setCanScrollRight(viewport.scrollLeft < maxScrollLeft - 4);
  };

  useEffect(() => {
    updateControls();

    const handleResize = () => {
      updateControls();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [itemKey]);

  const handleScroll = () => {
    updateControls();
  };

  const scrollByAmount = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const amount = Math.max(240, Math.floor(viewport.clientWidth * 0.58));
    viewport.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    didDragRef.current = false;
    isPointerDownRef.current = true;
    dragStartXRef.current = event.clientX;
    startScrollLeftRef.current = viewport.scrollLeft;
    setIsDragging(false);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    const deltaX = event.clientX - dragStartXRef.current;

    if (!isDragging && Math.abs(deltaX) > 4) {
      setIsDragging(true);
      viewport.setPointerCapture(event.pointerId);
    }

    if (!isDragging) return;

    if (Math.abs(deltaX) > 8) {
      didDragRef.current = true;
    }

    event.preventDefault();
    viewport.scrollLeft = startScrollLeftRef.current - deltaX;
    updateControls();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (viewport?.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }

    isPointerDownRef.current = false;
    setIsDragging(false);
  };

  const blockNativeDrag = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return {
    viewportRef,
    didDragRef,
    canScrollLeft,
    canScrollRight,
    isDragging,
    handleScroll,
    scrollByAmount,
    handlePointerDown,
    handlePointerMove,
    endDrag,
    blockNativeDrag,
  };
}
