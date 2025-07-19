'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { startTracking, endCurrentSession, trackClick, trackComplete } from '@/lib/tracking';

interface Note {
  key: string;
  frequency: number;
  isBlack: boolean;
}

export default function MusicMaker() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<Array<{ note: string; time: number }>>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentOctave, setCurrentOctave] = useState(4);
  const [volume, setVolume] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recordingStartTime = useRef<number>(0);

  const notes: Note[] = [
    { key: 'C', frequency: 261.63, isBlack: false },
    { key: 'C#', frequency: 277.18, isBlack: true },
    { key: 'D', frequency: 293.66, isBlack: false },
    { key: 'D#', frequency: 311.13, isBlack: true },
    { key: 'E', frequency: 329.63, isBlack: false },
    { key: 'F', frequency: 349.23, isBlack: false },
    { key: 'F#', frequency: 369.99, isBlack: true },
    { key: 'G', frequency: 392.00, isBlack: false },
    { key: 'G#', frequency: 415.30, isBlack: true },
    { key: 'A', frequency: 440.00, isBlack: false },
    { key: 'A#', frequency: 466.16, isBlack: true },
    { key: 'B', frequency: 493.88, isBlack: false },
  ];

  useEffect(() => {
    const tracker = startTracking('music-maker');
    
    return () => {
      endCurrentSession();
    };
  }, []);

  const getFrequency = (note: string, octave: number): number => {
    const baseNote = notes.find(n => n.key === note);
    if (!baseNote) return 0;
    return baseNote.frequency * Math.pow(2, octave - 4);
  };

  const playNote = (note: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const frequency = getFrequency(note, currentOctave);
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.5);

    trackClick('piano-key', { note, frequency, octave: currentOctave });

    if (isRecording) {
      const currentTime = Date.now() - recordingStartTime.current;
      setRecordedNotes(prev => [...prev, { note, time: currentTime }]);
    }
  };

  const startRecording = () => {
    setRecordedNotes([]);
    setIsRecording(true);
    recordingStartTime.current = Date.now();
    trackClick('record-button', { action: 'start' });
  };

  const stopRecording = () => {
    setIsRecording(false);
    trackClick('record-button', { action: 'stop', noteCount: recordedNotes.length });
  };

  const playRecording = async () => {
    if (recordedNotes.length === 0) return;

    setIsPlaying(true);
    trackClick('play-button', { action: 'play', noteCount: recordedNotes.length });

    for (let i = 0; i < recordedNotes.length; i++) {
      const noteData = recordedNotes[i];
      const nextNote = recordedNotes[i + 1];
      
      playNote(noteData.note);
      
      if (nextNote) {
        const delay = nextNote.time - noteData.time;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    setIsPlaying(false);
    trackComplete({ noteCount: recordedNotes.length });
  };

  const clearRecording = () => {
    setRecordedNotes([]);
    trackClick('clear-button');
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    const keyMap: { [key: string]: string } = {
      'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
      'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A',
      'u': 'A#', 'j': 'B'
    };

    const note = keyMap[e.key.toLowerCase()];
    if (note) {
      playNote(note);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentOctave, volume]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
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
            
            <h1 className="text-2xl font-bold text-gray-800">Music Maker</h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-gray-600" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-20 h-2 bg-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Piano */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* White Keys */}
                  <div className="flex">
                    {notes.filter(note => !note.isBlack).map((note, index) => (
                      <button
                        key={note.key}
                        onClick={() => playNote(note.key)}
                        className="w-16 h-32 bg-white border border-gray-300 rounded-b-lg hover:bg-gray-50 transition-colors relative z-10"
                      >
                        <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-700 font-medium">
                          {note.key}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Black Keys */}
                  <div className="absolute top-0 left-0 flex">
                    {notes.map((note, index) => {
                      if (note.isBlack) {
                        const whiteKeyIndex = notes.filter(n => !n.isBlack).findIndex(n => 
                          notes.indexOf(n) > notes.indexOf(note)
                        );
                        return (
                          <div key={note.key} className="relative" style={{ width: '64px' }}>
                            <button
                              onClick={() => playNote(note.key)}
                              className="absolute w-10 h-20 bg-gray-800 rounded-b-lg hover:bg-gray-700 transition-colors z-20"
                              style={{ left: '32px' }}
                            >
                              <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium">
                                {note.key}
                              </span>
                            </button>
                          </div>
                        );
                      }
                      return <div key={note.key} className="w-16" />;
                    })}
                  </div>
                </div>
              </div>

              {/* Octave Controls */}
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={() => setCurrentOctave(Math.max(2, currentOctave - 1))}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-gray-700 font-medium">
                  Octave {currentOctave}
                </span>
                <button
                  onClick={() => setCurrentOctave(Math.min(6, currentOctave + 1))}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Recording Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                
                <button
                  onClick={playRecording}
                  disabled={recordedNotes.length === 0 || isPlaying}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    recordedNotes.length === 0 || isPlaying
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  Play
                </button>
                
                <button
                  onClick={clearRecording}
                  disabled={recordedNotes.length === 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    recordedNotes.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Music Controls</h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">Recorded Notes</span>
                    <span className="font-bold text-gray-800">{recordedNotes.length}</span>
                  </div>
                  {recordedNotes.length > 0 && (
                    <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                      {recordedNotes.map((note, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{note.note}</span>
                          <span>{(note.time / 1000).toFixed(1)}s</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Status</span>
                  <div className="mt-1">
                    {isRecording && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Recording...
                      </span>
                    )}
                    {isPlaying && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Playing...
                      </span>
                    )}
                    {!isRecording && !isPlaying && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Ready
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">How to Play</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Click piano keys to play notes</li>
                  <li>• Use keyboard: A-J for white keys</li>
                  <li>• W,E,T,Y,U for black keys</li>
                  <li>• Record your melody and play it back!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 