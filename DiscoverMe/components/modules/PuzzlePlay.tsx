'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Trophy, Clock } from 'lucide-react';
import { startTracking, endCurrentSession, trackClick, trackComplete } from '@/lib/tracking';

interface Tile {
  id: number;
  value: number;
  isBlank: boolean;
}

export default function PuzzlePlay() {
  const router = useRouter();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [size, setSize] = useState(3);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);

  useEffect(() => {
    const tracker = startTracking('puzzle-play');
    initializePuzzle();
    
    return () => {
      endCurrentSession();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isComplete) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isComplete]);

  const initializePuzzle = () => {
    const totalTiles = size * size;
    const newTiles: Tile[] = [];
    
    for (let i = 0; i < totalTiles - 1; i++) {
      newTiles.push({ id: i, value: i + 1, isBlank: false });
    }
    newTiles.push({ id: totalTiles - 1, value: 0, isBlank: true });
    
    // Shuffle the tiles
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }
    
    setTiles(newTiles);
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
    setIsComplete(false);
  };

  const canMove = (index: number): boolean => {
    const blankIndex = tiles.findIndex(tile => tile.isBlank);
    const row = Math.floor(index / size);
    const col = index % size;
    const blankRow = Math.floor(blankIndex / size);
    const blankCol = blankIndex % size;
    
    return (
      (Math.abs(row - blankRow) === 1 && col === blankCol) ||
      (Math.abs(col - blankCol) === 1 && row === blankRow)
    );
  };

  const moveTile = (index: number) => {
    if (!canMove(index) || isComplete) return;
    
    const blankIndex = tiles.findIndex(tile => tile.isBlank);
    const newTiles = [...tiles];
    
    // Swap tiles
    [newTiles[index], newTiles[blankIndex]] = [newTiles[blankIndex], newTiles[index]];
    
    setTiles(newTiles);
    setMoves(prev => prev + 1);
    trackClick('tile', { action: 'move', from: index, to: blankIndex });
    
    // Check if puzzle is complete
    if (checkComplete(newTiles)) {
      setIsComplete(true);
      setIsPlaying(false);
      trackComplete({ moves, time, size });
      
      // Update best time
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
    }
  };

  const checkComplete = (currentTiles: Tile[]): boolean => {
    for (let i = 0; i < currentTiles.length - 1; i++) {
      if (currentTiles[i].value !== i + 1) return false;
    }
    return currentTiles[currentTiles.length - 1].isBlank;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTileColor = (value: number): string => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
    ];
    return colors[(value - 1) % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
            
            <h1 className="text-2xl font-bold text-gray-800">Puzzle Play</h1>
            
            <button
              onClick={initializePuzzle}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>New Game</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex justify-center mb-6">
                <div 
                  className="grid gap-2"
                  style={{ 
                    gridTemplateColumns: `repeat(${size}, 1fr)`,
                    width: `${size * 80}px`
                  }}
                >
                  {tiles.map((tile, index) => (
                    <button
                      key={tile.id}
                      onClick={() => moveTile(index)}
                      className={`
                        w-20 h-20 rounded-lg text-white font-bold text-xl
                        transition-all duration-200 transform hover:scale-105
                        ${tile.isBlank 
                          ? 'bg-gray-300 cursor-default hover:scale-100' 
                          : `${getTileColor(tile.value)} cursor-pointer shadow-lg hover:shadow-xl`
                        }
                        ${canMove(index) && !tile.isBlank ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
                      `}
                      disabled={tile.isBlank || !canMove(index)}
                    >
                      {tile.isBlank ? '' : tile.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="flex justify-center space-x-4">
                {[3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSize(s);
                      setTimeout(initializePuzzle, 100);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      size === s 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {s}x{s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Game Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Time</span>
                  </div>
                  <span className="font-mono font-bold text-gray-800">
                    {formatTime(time)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Moves</span>
                  <span className="font-bold text-gray-800">{moves}</span>
                </div>

                {bestTime && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span className="text-gray-700">Best Time</span>
                    </div>
                    <span className="font-mono font-bold text-yellow-700">
                      {formatTime(bestTime)}
                    </span>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">How to Play</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Click tiles to move them</li>
                  <li>• Arrange numbers in order</li>
                  <li>• Empty space should be bottom-right</li>
                  <li>• Try to solve in fewer moves!</li>
                </ul>
              </div>

              {/* Completion Message */}
              {isComplete && (
                <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="w-6 h-6 text-green-600" />
                    <h4 className="font-medium text-green-800">Puzzle Complete!</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    Great job! You solved it in {moves} moves and {formatTime(time)}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 