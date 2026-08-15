import { useEffect, useMemo, useRef, useState } from 'react';
import { clamp } from './types';

export function useCarSlider(itemCount: number) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const measureCardRef = useRef<HTMLDivElement | null>(null);
  const dragFrameRef = useRef<number | null>(null);
  const dragOffsetRef = useRef(0);
  const startXRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const indexRef = useRef(0);

  const [cardWidth, setCardWidth] = useState(220);
  const [gap, setGap] = useState(16);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const step = cardWidth + gap;

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const visibleCount = useMemo(() => {
    if (!viewportWidth) return 1;
    return Math.max(1, Math.floor((viewportWidth + gap) / step));
  }, [viewportWidth, gap, step]);

  const maxIndex = useMemo(() => {
    return Math.max(0, itemCount - visibleCount);
  }, [itemCount, visibleCount]);

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const card = measureCardRef.current;
      if (!viewport || !track || !card) return;

      const viewportRect = viewport.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const computedTrackStyles = window.getComputedStyle(track);
      const parsedGap =
        Number.parseFloat(computedTrackStyles.columnGap || computedTrackStyles.gap || '') || 16;

      setViewportWidth(viewportRect.width);
      setCardWidth(cardRect.width);
      setGap(parsedGap);
    };

    measure();
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', measure);
      if (dragFrameRef.current !== null) {
        cancelAnimationFrame(dragFrameRef.current);
      }
    };
  }, [itemCount]);

  useEffect(() => {
    setIndex((prev) => clamp(prev, 0, maxIndex));
  }, [maxIndex]);

  const setDragOffsetSmooth = (value: number) => {
    dragOffsetRef.current = value;
    if (dragFrameRef.current !== null) return;

    dragFrameRef.current = window.requestAnimationFrame(() => {
      dragFrameRef.current = null;
      setDragOffset(dragOffsetRef.current);
    });
  };

  const goTo = (nextIndex: number) => {
    const clampedIndex = clamp(nextIndex, 0, maxIndex);
    indexRef.current = clampedIndex;
    setIndex(clampedIndex);
  };

  const finishDrag = () => {
    const movedBy = dragOffsetRef.current;
    const threshold = step / 2;

    if (Math.abs(movedBy) > 8) {
      didDragRef.current = true;
    }

    isDraggingRef.current = false;
    setIsDragging(false);
    dragOffsetRef.current = 0;
    setDragOffset(0);

    if (Math.abs(movedBy) < threshold) return;

    if (movedBy < 0) {
      goTo(indexRef.current + 1);
      return;
    }

    goTo(indexRef.current - 1);
  };

  const resetDragState = () => {
    isPointerDownRef.current = false;
    isDraggingRef.current = false;
    setIsDragging(false);
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    didDragRef.current = false;
    isPointerDownRef.current = true;
    startXRef.current = event.clientX;
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const nextOffset = event.clientX - startXRef.current;

    if (!isDraggingRef.current && Math.abs(nextOffset) > 8) {
      isDraggingRef.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    if (!isDraggingRef.current) return;

    setDragOffsetSmooth(nextOffset);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    if (isDraggingRef.current) {
      finishDrag();
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }

    isPointerDownRef.current = false;
  };

  const onPointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current && !isDraggingRef.current) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    resetDragState();
  };

  const onPrev = () => {
    if (isDraggingRef.current) return;
    goTo(indexRef.current - 1);
  };

  const onNext = () => {
    if (isDraggingRef.current) return;
    goTo(indexRef.current + 1);
  };

  const translateX = -index * step + dragOffset;

  return {
    viewportRef,
    trackRef,
    measureCardRef,
    didDragRef,
    cardWidth,
    index,
    maxIndex,
    isDragging,
    translateX,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPrev,
    onNext,
  };
}
