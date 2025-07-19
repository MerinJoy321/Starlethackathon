'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Palette, 
  Puzzle, 
  Music, 
  Calculator, 
  Blocks,
  Sparkles
} from 'lucide-react';

const activities = [
  {
    id: 'art-pad',
    name: 'Art Pad',
    description: 'Express yourself through digital art and creativity',
    icon: Palette,
    color: 'from-pink-400 to-rose-500',
    bgColor: 'bg-gradient-to-br from-pink-100 to-rose-100',
    difficulty: 'beginner',
    category: 'creative'
  },
  {
    id: 'puzzle-play',
    name: 'Puzzle Play',
    description: 'Solve fun puzzles and brain teasers',
    icon: Puzzle,
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    difficulty: 'intermediate',
    category: 'cognitive'
  },
  {
    id: 'music-maker',
    name: 'Music Maker',
    description: 'Create beautiful melodies and rhythms',
    icon: Music,
    color: 'from-purple-400 to-violet-500',
    bgColor: 'bg-gradient-to-br from-purple-100 to-violet-100',
    difficulty: 'beginner',
    category: 'creative'
  },
  {
    id: 'math-explorer',
    name: 'Math Explorer',
    description: 'Discover the magic of numbers and patterns',
    icon: Calculator,
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-gradient-to-br from-green-100 to-emerald-100',
    difficulty: 'intermediate',
    category: 'cognitive'
  },
  {
    id: 'builder-zone',
    name: 'Builder Zone',
    description: 'Build amazing structures and creations',
    icon: Blocks,
    color: 'from-orange-400 to-amber-500',
    bgColor: 'bg-gradient-to-br from-orange-100 to-amber-100',
    difficulty: 'advanced',
    category: 'physical'
  }
];

export default function ActivityLauncher() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = ['all', 'creative', 'cognitive', 'social', 'physical'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredActivities = activities.filter(activity => {
    const categoryMatch = selectedCategory === 'all' || activity.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || activity.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">Category:</span>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">Difficulty:</span>
            <select 
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <Link 
              key={activity.id} 
              href={`/modules/${activity.id}`}
              className="group block"
            >
              <div className={`
                ${activity.bgColor} 
                rounded-2xl p-6 h-64 
                transform transition-all duration-300 
                group-hover:scale-105 group-hover:shadow-xl
                border border-white/50
                relative overflow-hidden
              `}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/20"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/20"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 rounded-2xl bg-gradient-to-br ${activity.color} 
                    flex items-center justify-center mb-4
                    group-hover:animate-pulse-glow
                  `}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {activity.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm flex-grow">
                    {activity.description}
                  </p>

                  {/* Badges */}
                  <div className="flex gap-2 mt-4">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${activity.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        activity.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'}
                    `}>
                      {activity.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {activity.category}
                    </span>
                  </div>

                  {/* Sparkle Effect */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-5 h-5 text-yellow-400 animate-bounce-slow" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No activities found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters to see more activities.
          </p>
        </div>
      )}
    </div>
  );
} 