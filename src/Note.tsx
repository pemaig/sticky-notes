import { useState, useRef } from 'react';
import type { PointerEvent } from 'react';
import { MIN_NOTE_HEIGHT, MIN_NOTE_WIDTH } from './constants.ts';

interface NoteProps {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function Note({ text, x, y, width, height }: NoteProps) {
  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height });

  const elementRef = useRef<HTMLDivElement | null>(null);
  const dragDataRef = useRef({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
  });
  const resizeDataRef = useRef({
    isResizing: false,
    direction: '',
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startPositionX: 0,
    startPositionY: 0,
  });

  const applyTransform = (x: number, y: number) => {
    if (!elementRef.current) {
      return;
    }

    elementRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const applySize = (width: number, height: number) => {
    if (!elementRef.current) {
      return;
    }

    elementRef.current.style.width = `${width}px`;
    elementRef.current.style.height = `${height}px`;
  };

  const handleDragStart = (e: PointerEvent<HTMLDivElement>) => {
    if (!elementRef.current) {
      return;
    }

    elementRef.current.style.cursor = 'grab';

    dragDataRef.current = {
      isDragging: true,
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y,
    };

    elementRef.current.setPointerCapture(e.pointerId);
  };

  const handleResizeStart = (e: PointerEvent<HTMLDivElement>) => {
    if (!elementRef.current) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    resizeDataRef.current = {
      isResizing: true,
      direction: 'se',
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
      startPositionX: position.x,
      startPositionY: position.y,
    };

    elementRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!elementRef.current) {
      return;
    }

    if (dragDataRef.current.isDragging) {
      const newX = e.clientX - dragDataRef.current.offsetX;
      const newY = e.clientY - dragDataRef.current.offsetY;
      applyTransform(newX, newY);
    } else if (resizeDataRef.current.isResizing) {
      const { direction, startX, startY, startWidth, startHeight } = resizeDataRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('e')) {
        newWidth = Math.max(MIN_NOTE_WIDTH, startWidth + deltaX);
      }
      if (direction.includes('s')) {
        newHeight = Math.max(MIN_NOTE_HEIGHT, startHeight + deltaY);
      }

      applySize(newWidth, newHeight);
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!elementRef.current) return;

    elementRef.current.style.cursor = 'initial';

    if (dragDataRef.current.isDragging || resizeDataRef.current.isResizing) {
      const rect = elementRef.current.getBoundingClientRect();
      const newPosition = {
        x: rect.left,
        y: rect.top,
      };
      const newSize = {
        width: rect.width,
        height: rect.height,
      };

      setPosition(newPosition);
      setSize(newSize);

      dragDataRef.current.isDragging = false;
      resizeDataRef.current.isResizing = false;
      elementRef.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={elementRef}
      onPointerDown={handleDragStart}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: size.width,
        height: size.height,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className="absolute bg-yellow-100 border border-yellow-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.12)] select-none group"
    >
      <textarea
        className="w-full h-full p-4 bg-transparent resize-none outline-none text-gray-800 placeholder:text-gray-500"
        defaultValue={text}
      />

      <div
        className="cursor-se-resize absolute w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity bottom-0 right-0"
        onPointerDown={handleResizeStart}
      >
        <div className="w-2 h-2 bg-blue-400 rounded-full mx-auto my-auto border border-white" />
      </div>
    </div>
  );
}
