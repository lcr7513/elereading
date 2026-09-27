import React, { useRef, useState, useEffect } from 'react';
import { Palette, Eraser, RotateCcw, Trash2, Check, Sparkles } from 'lucide-react';

interface DrawingCanvasProps {
  initialData?: string;
  onSave: (imageData: string) => void;
  width?: number;
  height?: number;
  title?: string;
}

const COLORS = [
  '#000000', // 검정
  '#dc2626', // 빨강
  '#ea580c', // 주황
  '#ca8a04', // 노랑
  '#16a34a', // 초록
  '#0284c7', // 하늘
  '#2563eb', // 파랑
  '#9333ea', // 보라
  '#db2777', // 핑크
  '#78350f', // 갈색
  '#64748b', // 회색
  '#ffffff', // 흰색
];

const BRUSH_SIZES = [2, 4, 8, 14, 22];

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  initialData,
  onSave,
  width = 640,
  height = 360,
  title = '독서 감상화 그리기'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Keep state in sync for native event handlers
  const colorRef = useRef(color);
  colorRef.current = color;
  const brushSizeRef = useRef(brushSize);
  brushSizeRef.current = brushSize;
  const isEraserRef = useRef(isEraser);
  isEraserRef.current = isEraser;

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => [...prev.slice(0, historyStep + 1), imageData]);
      setHistoryStep((prev) => prev + 1);
    } catch (e) {
      console.warn('saveState failed:', e);
    }
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    } catch (e) {
      console.warn('exportCanvas error:', e);
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background by default
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveState();
      };
      img.src = initialData;
    } else {
      saveState();
    }
  }, []);

  // Native non-passive touch listeners for mobile smooth drawing without scrolling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (touch: Touch) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      isDrawingRef.current = true;
      const { x, y } = getPos(e.touches[0]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = isEraserRef.current ? '#ffffff' : colorRef.current;
      ctx.lineWidth = brushSizeRef.current;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDrawingRef.current || e.touches.length !== 1) return;
      e.preventDefault();
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { x, y } = getPos(e.touches[0]);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      isDrawingRef.current = false;
      saveState();
      exportCanvas();
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [historyStep]);

  // Mouse handlers for desktop
  const getMouseCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const { x, y } = getMouseCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getMouseCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    saveState();
    exportCanvas();
  };

  const undo = () => {
    if (historyStep <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevStep = historyStep - 1;
    ctx.putImageData(history[prevStep], 0, 0);
    setHistoryStep(prevStep);
    exportCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
    exportCanvas();
  };

  return (
    <div id="drawing-canvas-container" className="bg-amber-50/70 p-3 sm:p-4 rounded-2xl border-2 border-amber-200">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
          <span className="font-bold text-stone-800 text-xs sm:text-sm">{title}</span>
          <span className="text-[11px] text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full font-medium hidden sm:inline">
            손가락이나 터치펜으로 그려보세요!
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={undo}
            disabled={historyStep <= 0}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-40 transition-colors shadow-2xs font-semibold"
            title="실행 취소"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>되돌리기</span>
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors shadow-2xs font-semibold"
            title="전체 지우기"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>지우기</span>
          </button>
        </div>
      </div>

      {/* Palette & Tools Toolbar (Optimized for mobile thumbs) */}
      <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs mb-2.5 space-y-2">
        {/* Colors Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap">색상:</span>
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                }}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 sm:w-6 sm:h-6 rounded-full border-2 transition-all flex-shrink-0 ${
                  !isEraser && color === c
                    ? 'scale-115 border-stone-900 shadow-md ring-2 ring-amber-400'
                    : 'border-stone-200 hover:scale-105 active:scale-95'
                }`}
                title={c}
                aria-label={`색상 ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Tools & Brush Size Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
          {/* Eraser */}
          <button
            type="button"
            onClick={() => setIsEraser(!isEraser)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              isEraser
                ? 'bg-amber-500 text-white border-amber-600 shadow-inner'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>지우개 {isEraser ? 'ON' : ''}</span>
          </button>

          {/* Brush Sizes */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-stone-500 font-bold">굵기:</span>
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setBrushSize(size)}
                className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-all ${
                  brushSize === size
                    ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold ring-1 ring-amber-300'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span
                  className="rounded-full bg-stone-800"
                  style={{ width: Math.max(3, size / 1.5), height: Math.max(3, size / 1.5) }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Area with touch-none */}
      <div className="relative w-full overflow-hidden rounded-xl border-2 border-stone-300 bg-white shadow-inner flex justify-center items-center">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-auto max-h-[360px] touch-none cursor-crosshair object-contain bg-white block"
          style={{ touchAction: 'none' }}
        />
      </div>
      <p className="text-[11px] text-stone-500 text-center mt-1.5 sm:hidden">
        👆 캔버스 위에서 손가락으로 자유롭게 터치하여 그림을 그리세요.
      </p>
    </div>
  );
};
