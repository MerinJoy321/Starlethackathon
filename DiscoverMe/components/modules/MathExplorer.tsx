'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Check, X, Star } from 'lucide-react';
import { startTracking, endCurrentSession, trackClick, trackComplete } from '@/lib/tracking';

interface Problem {
  id: number;
  question: string;
  answer: number;
  type: 'addition' | 'subtraction' | 'multiplication' | 'division';
  difficulty: 'easy' | 'medium' | 'hard';
  visualAids?: string[];
}

export default function MathExplorer() {
  const router = useRouter();
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showHint, setShowHint] = useState(false);

  const problems: Problem[] = [
    // Easy problems
    { id: 1, question: 'What is 5 + 3?', answer: 8, type: 'addition', difficulty: 'easy' },
    { id: 2, question: 'What is 10 - 4?', answer: 6, type: 'subtraction', difficulty: 'easy' },
    { id: 3, question: 'What is 2 × 3?', answer: 6, type: 'multiplication', difficulty: 'easy' },
    { id: 4, question: 'What is 8 ÷ 2?', answer: 4, type: 'division', difficulty: 'easy' },
    { id: 5, question: 'What is 7 + 2?', answer: 9, type: 'addition', difficulty: 'easy' },
    
    // Medium problems
    { id: 6, question: 'What is 15 + 8?', answer: 23, type: 'addition', difficulty: 'medium' },
    { id: 7, question: 'What is 20 - 7?', answer: 13, type: 'subtraction', difficulty: 'medium' },
    { id: 8, question: 'What is 4 × 6?', answer: 24, type: 'multiplication', difficulty: 'medium' },
    { id: 9, question: 'What is 18 ÷ 3?', answer: 6, type: 'division', difficulty: 'medium' },
    { id: 10, question: 'What is 12 + 9?', answer: 21, type: 'addition', difficulty: 'medium' },
    
    // Hard problems
    { id: 11, question: 'What is 25 + 17?', answer: 42, type: 'addition', difficulty: 'hard' },
    { id: 12, question: 'What is 35 - 12?', answer: 23, type: 'subtraction', difficulty: 'hard' },
    { id: 13, question: 'What is 7 × 8?', answer: 56, type: 'multiplication', difficulty: 'hard' },
    { id: 14, question: 'What is 32 ÷ 4?', answer: 8, type: 'division', difficulty: 'hard' },
    { id: 15, question: 'What is 19 + 14?', answer: 33, type: 'addition', difficulty: 'hard' },
  ];

  useEffect(() => {
    const tracker = startTracking('math-explorer');
    generateNewProblem();
    
    return () => {
      endCurrentSession();
    };
  }, []);

  const generateNewProblem = () => {
    const filteredProblems = problems.filter(p => p.difficulty === difficulty);
    const randomProblem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    setCurrentProblem(randomProblem);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
    trackClick('new-problem', { difficulty, problemType: randomProblem.type });
  };

  const checkAnswer = () => {
    if (!currentProblem || !userAnswer) return;

    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      trackClick('submit-answer', { correct: true, answer: userAnswer });
    } else {
      setStreak(0);
      trackClick('submit-answer', { correct: false, answer: userAnswer, expected: currentProblem.answer });
    }
    
    setTotalProblems(prev => prev + 1);
    
    // Auto-generate new problem after 2 seconds
    setTimeout(() => {
      generateNewProblem();
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const getVisualAid = (problem: Problem) => {
    if (problem.type === 'addition') {
      const [a, b] = problem.question.match(/\d+/g)?.map(Number) || [];
      return (
        <div className="flex items-center justify-center space-x-4 text-2xl">
          <div className="flex space-x-1">
            {Array.from({ length: a }, (_, i) => (
              <div key={i} className="w-6 h-6 bg-blue-400 rounded-full"></div>
            ))}
          </div>
          <span>+</span>
          <div className="flex space-x-1">
            {Array.from({ length: b }, (_, i) => (
              <div key={i} className="w-6 h-6 bg-green-400 rounded-full"></div>
            ))}
          </div>
          <span>=</span>
          <span className="text-gray-400">?</span>
        </div>
      );
    }
    
    if (problem.type === 'multiplication') {
      const [a, b] = problem.question.match(/\d+/g)?.map(Number) || [];
      return (
        <div className="grid grid-cols-5 gap-1 max-w-xs mx-auto">
          {Array.from({ length: a * b }, (_, i) => (
            <div key={i} className="w-4 h-4 bg-purple-400 rounded"></div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  const getHint = (problem: Problem) => {
    const [a, b] = problem.question.match(/\d+/g)?.map(Number) || [];
    
    switch (problem.type) {
      case 'addition':
        return `Try counting: ${a} + ${b} = ?`;
      case 'subtraction':
        return `Start with ${a} and count backwards ${b} times`;
      case 'multiplication':
        return `${a} groups of ${b} = ${a} × ${b}`;
      case 'division':
        return `How many groups of ${b} make ${a}?`;
      default:
        return 'Think about the operation carefully';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
            
            <h1 className="text-2xl font-bold text-gray-800">Math Explorer</h1>
            
            <button
              onClick={generateNewProblem}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>New Problem</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Problem Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              {currentProblem && (
                <>
                  {/* Problem Display */}
                  <div className="text-center mb-8">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {currentProblem.type.charAt(0).toUpperCase() + currentProblem.type.slice(1)}
                      </span>
                    </div>
                    
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                      {currentProblem.question}
                    </h2>
                    
                    {/* Visual Aid */}
                    <div className="mb-6">
                      {getVisualAid(currentProblem)}
                    </div>
                    
                    {/* Answer Input */}
                    <div className="flex justify-center items-center space-x-4">
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-24 h-16 text-3xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="?"
                        disabled={feedback !== null}
                      />
                      
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer || feedback !== null}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                          !userAnswer || feedback !== null
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Feedback */}
                    {feedback && (
                      <div className={`mt-4 p-4 rounded-lg ${
                        feedback === 'correct' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        <div className="flex items-center justify-center space-x-2">
                          {feedback === 'correct' ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <X className="w-5 h-5" />
                          )}
                          <span className="font-medium">
                            {feedback === 'correct' 
                              ? 'Correct! Great job!' 
                              : `Incorrect. The answer is ${currentProblem.answer}`
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Hint */}
                  <div className="text-center">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    {showHint && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg text-blue-800">
                        {getHint(currentProblem)}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Math Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Score</span>
                  <span className="font-bold text-gray-800">{score}/{totalProblems}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Accuracy</span>
                  <span className="font-bold text-gray-800">
                    {totalProblems > 0 ? Math.round((score / totalProblems) * 100) : 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-700">Streak</span>
                  </div>
                  <span className="font-bold text-yellow-700">{streak}</span>
                </div>
              </div>

              {/* Difficulty Selector */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">Difficulty</h4>
                <div className="space-y-2">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`w-full p-3 rounded-lg font-medium transition-colors ${
                        difficulty === level
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">How to Play</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Solve the math problem</li>
                  <li>• Type your answer and press Enter</li>
                  <li>• Use hints if you need help</li>
                  <li>• Build your streak!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 