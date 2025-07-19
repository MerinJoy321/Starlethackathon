'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Palette, Eraser, Download, RotateCcw } from 'lucide-react';
import { startTracking, endCurrentSession, trackClick, trackDrag } from '@/lib/tracking';

interface Point {
  x: number;
  y: number;
}

export default function ArtPad() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  useEffect(() => {
    const tracker = startTracking('art-pad');
    
    return () => {
      endCurrentSession();
    };
  }, []);

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    return { canvas, ctx };
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const drawLine = (from: Point, to: Point) => {
    const context = getCanvasContext();
    if (!context) return;
    
    const { ctx } = context;
    
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    setLastPoint(pos);
    trackClick('canvas', { action: 'start-draw', tool, color, brushSize });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    
    const pos = getMousePos(e);
    drawLine(lastPoint, pos);
    setLastPoint(pos);
    trackDrag('canvas', { action: 'draw', tool, color, brushSize });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPoint(null);
    trackClick('canvas', { action: 'end-draw' });
  };

  const clearCanvas = () => {
    const context = getCanvasContext();
    if (!context) return;
    
    const { canvas, ctx } = context;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trackClick('clear-button');
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'neurobloom-artwork.png';
    link.href = canvas.toDataURL();
    link.click();
    trackClick('download-button');
  };

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Activities</span>
            </button>
            
            <h1 className="text-2xl font-bold text-gray-800">Art Pad</h1>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={clearCanvas}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="Clear Canvas"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={downloadCanvas}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="Download Artwork"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Tools</h3>
              
              {/* Tool Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tool</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTool('brush')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      tool === 'brush' 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title="Brush"
                  >
                    <Palette className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      tool === 'eraser' 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title="Eraser"
                  >
                    <Eraser className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Color Palette */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((colorOption) => (
                    <button
                      key={colorOption}
                      onClick={() => setColor(colorOption)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        color === colorOption ? 'border-gray-800 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: colorOption }}
                      title={colorOption}
                    />
                  ))}
                </div>
              </div>

              {/* Brush Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brush Size: {brushSize}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">How to Draw</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Click and drag to draw</li>
                  <li>• Use the eraser to remove</li>
                  <li>• Change colors and brush size</li>
                  <li>• Download your artwork!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="border-2 border-gray-200 rounded-lg cursor-crosshair"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 