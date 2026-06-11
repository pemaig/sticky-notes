import { useState, useRef } from 'react';
import type { PointerEvent } from 'react';

interface NoteProps {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function Note({ text, x, y, width, height }: NoteProps) {
  const [position, setPosition] = useState({ x: x, y: y });
  const elementRef = useRef<HTMLDivElement | null>(null);
  const dragData = useRef({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
    currentX: position.x,
    currentY: position.y,
  });

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!elementRef.current) {
      return;
    }

    elementRef.current.style.cursor = 'grab';

    dragData.current.isDragging = true;
    dragData.current.offsetX = e.clientX - dragData.current.currentX;
    dragData.current.offsetY = e.clientY - dragData.current.currentY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragData.current.isDragging || !elementRef.current) {
      return;
    }

    dragData.current.currentX = e.clientX - dragData.current.offsetX;
    dragData.current.currentY = e.clientY - dragData.current.offsetY;
    elementRef.current.style.transform = `translate(${dragData.current.currentX}px, ${dragData.current.currentY}px)`;
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!elementRef.current) {
      return;
    }

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
        width: width,
        height: height,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className="absolute p-4 bg-yellow-100 border border-yellow-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.12)] text-gray-800 cursor-grab active:cursor-grabbing select-none touch-none"
    >
      <textarea
        className="w-full h-full bg-transparent resize-none outline-none text-gray-800 placeholder:text-gray-500"
        defaultValue={text}
      />
    </div>
  );
}
