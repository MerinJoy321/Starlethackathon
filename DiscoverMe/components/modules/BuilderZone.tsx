'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Download, Trash2, Save } from 'lucide-react';
import { startTracking, endCurrentSession, trackClick, trackDrag, trackComplete } from '@/lib/tracking';

interface BuildingBlock {
  id: string;
  type: 'cube' | 'sphere' | 'cylinder' | 'pyramid';
  color: string;
  position: { x: number; y: number };
  size: number;
}

interface Template {
  id: string;
  name: string;
  blocks: BuildingBlock[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function BuilderZone() {
  const router = useRouter();
  const [blocks, setBlocks] = useState<BuildingBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BuildingBlock | null>(null);
  const [currentColor, setCurrentColor] = useState('#3B82F6');
  const [currentSize, setCurrentSize] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const templates: Template[] = [
    {
      id: 'house',
      name: 'Simple House',
      difficulty: 'easy',
      blocks: [
        { id: '1', type: 'cube', color: '#8B4513', position: { x: 200, y: 300 }, size: 100 },
        { id: '2', type: 'pyramid', color: '#A0522D', position: { x: 200, y: 200 }, size: 100 },
        { id: '3', type: 'cube', color: '#87CEEB', position: { x: 180, y: 320 }, size: 20 },
        { id: '4', type: 'cube', color: '#87CEEB', position: { x: 220, y: 320 }, size: 20 },
      ]
    },
    {
      id: 'tower',
      name: 'Tower',
      difficulty: 'medium',
      blocks: [
        { id: '1', type: 'cube', color: '#696969', position: { x: 200, y: 350 }, size: 80 },
        { id: '2', type: 'cube', color: '#696969', position: { x: 200, y: 270 }, size: 60 },
        { id: '3', type: 'cube', color: '#696969', position: { x: 200, y: 190 }, size: 40 },
        { id: '4', type: 'sphere', color: '#FFD700', position: { x: 200, y: 150 }, size: 30 },
      ]
    },
    {
      id: 'robot',
      name: 'Robot',
      difficulty: 'hard',
      blocks: [
        { id: '1', type: 'cube', color: '#C0C0C0', position: { x: 200, y: 350 }, size: 60 },
        { id: '2', type: 'sphere', color: '#C0C0C0', position: { x: 200, y: 290 }, size: 40 },
        { id: '3', type: 'cube', color: '#FF6B6B', position: { x: 180, y: 280 }, size: 15 },
        { id: '4', type: 'cube', color: '#FF6B6B', position: { x: 220, y: 280 }, size: 15 },
        { id: '5', type: 'cylinder', color: '#4ECDC4', position: { x: 200, y: 250 }, size: 20 },
      ]
    }
  ];

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  useEffect(() => {
    const tracker = startTracking('builder-zone');
    
    return () => {
      endCurrentSession();
    };
  }, []);

  const addBlock = (type: BuildingBlock['type']) => {
    const newBlock: BuildingBlock = {
      id: Date.now().toString(),
      type,
      color: currentColor,
      position: { x: 200, y: 200 },
      size: currentSize
    };
    
    setBlocks(prev => [...prev, newBlock]);
    trackClick('add-block', { type, color: currentColor, size: currentSize });
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
    trackClick('remove-block', { blockId: id });
  };

  const handleMouseDown = (e: React.MouseEvent, block: BuildingBlock) => {
    setIsDragging(true);
    setSelectedBlock(block);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    trackClick('start-drag', { blockId: block.id, type: block.type });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedBlock) return;

    const canvas = e.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    setBlocks(prev => prev.map(block =>
      block.id === selectedBlock.id
        ? { ...block, position: { x, y } }
        : block
    ));

    trackDrag('canvas', { blockId: selectedBlock.id, position: { x, y } });
  };

  const handleMouseUp = () => {
    if (isDragging && selectedBlock) {
      trackComplete({ action: 'move-block', blockId: selectedBlock.id });
    }
    setIsDragging(false);
    setSelectedBlock(null);
  };

  const loadTemplate = (template: Template) => {
    setBlocks(template.blocks.map(block => ({
      ...block,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    })));
    setSelectedTemplate(template);
    trackClick('load-template', { templateId: template.id, difficulty: template.difficulty });
  };

  const clearCanvas = () => {
    setBlocks([]);
    setSelectedTemplate(null);
    trackClick('clear-canvas');
  };

  const saveCreation = () => {
    const creation = {
      blocks,
      timestamp: new Date().toISOString(),
      blockCount: blocks.length
    };
    
    const dataStr = JSON.stringify(creation);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'neurobloom-creation.json';
    link.click();
    
    trackClick('save-creation', { blockCount: blocks.length });
  };

  const getBlockStyle = (block: BuildingBlock) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: block.position.x,
      top: block.position.y,
      width: block.size,
      height: block.size,
      backgroundColor: block.color,
      cursor: 'grab',
      border: selectedBlock?.id === block.id ? '3px solid #FFD700' : '2px solid rgba(0,0,0,0.1)',
      transition: isDragging ? 'none' : 'all 0.2s ease',
      zIndex: selectedBlock?.id === block.id ? 10 : 1
    };

    switch (block.type) {
      case 'sphere':
        return { ...baseStyle, borderRadius: '50%' };
      case 'cylinder':
        return { ...baseStyle, borderRadius: '25%' };
      case 'pyramid':
        return { 
          ...baseStyle, 
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          height: block.size * 0.8
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
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
            
            <h1 className="text-2xl font-bold text-gray-800">Builder Zone</h1>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={saveCreation}
                disabled={blocks.length === 0}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>Save</span>
              </button>
              <button
                onClick={clearCanvas}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear</span>
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
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Building Tools</h3>
              
              {/* Block Types */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Blocks</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addBlock('cube')}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Cube"
                  >
                    <div className="w-6 h-6 bg-gray-600 mx-auto"></div>
                  </button>
                  <button
                    onClick={() => addBlock('sphere')}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Sphere"
                  >
                    <div className="w-6 h-6 bg-gray-600 rounded-full mx-auto"></div>
                  </button>
                  <button
                    onClick={() => addBlock('cylinder')}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Cylinder"
                  >
                    <div className="w-6 h-6 bg-gray-600 rounded-lg mx-auto"></div>
                  </button>
                  <button
                    onClick={() => addBlock('pyramid')}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Pyramid"
                  >
                    <div className="w-0 h-0 border-l-3 border-r-3 border-b-6 border-l-transparent border-r-transparent border-b-gray-600 mx-auto"></div>
                  </button>
                </div>
              </div>

              {/* Color Palette */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        currentColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Size Control */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size: {currentSize}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={currentSize}
                  onChange={(e) => setCurrentSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Templates */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Templates</label>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => loadTemplate(template)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedTemplate?.id === template.id
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs opacity-75 capitalize">{template.difficulty}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">How to Build</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Click block types to add them</li>
                  <li>• Drag blocks to move them</li>
                  <li>• Change colors and sizes</li>
                  <li>• Try the templates!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Building Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="relative bg-gradient-to-b from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300"
                   style={{ height: '500px' }}
                   onMouseMove={handleMouseMove}
                   onMouseUp={handleMouseUp}
                   onMouseLeave={handleMouseUp}>
                
                {/* Building Blocks */}
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    style={getBlockStyle(block)}
                    onMouseDown={(e) => handleMouseDown(e, block)}
                    className="hover:shadow-lg"
                  >
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors opacity-0 hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Empty State */}
                {blocks.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                        <RotateCcw className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium">Start Building!</p>
                      <p className="text-sm">Add blocks from the tools panel</p>
                    </div>
                  </div>
                )}

                {/* Stats */}
                {blocks.length > 0 && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
                    <div className="font-medium text-gray-800">{blocks.length} blocks</div>
                    {selectedTemplate && (
                      <div className="text-gray-600">{selectedTemplate.name}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 