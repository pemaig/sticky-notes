import { useState, useRef } from 'react';
import type { PointerEvent } from 'react';

export function Note() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const elementRef = useRef<HTMLDivElement | null>(null);
  const dragData = useRef({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
    currentX: position.x,
    currentY: position.y,
  });

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!elementRef.current) return;

    elementRef.current.style.cursor = 'grab';

    dragData.current.isDragging = true;
    dragData.current.offsetX = e.clientX - dragData.current.currentX;
    dragData.current.offsetY = e.clientY - dragData.current.currentY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragData.current.isDragging || !elementRef.current) return;

    dragData.current.currentX = e.clientX - dragData.current.offsetX;
    dragData.current.currentY = e.clientY - dragData.current.offsetY;
    elementRef.current.style.transform = `translate(${dragData.current.currentX}px, ${dragData.current.currentY}px)`;
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!elementRef.current) return;

    elementRef.current.style.cursor = 'initial';

    dragData.current.isDragging = false;
    setPosition({
      x: dragData.current.currentX,
      y: dragData.current.currentY,
    });
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={elementRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'absolute',
        width: 200,
        height: 200,
        background: 'yellow',
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      Sticky Note
    </div>
  );
}
