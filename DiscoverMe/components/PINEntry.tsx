'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function PINEntry() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        router.push('/caregiver');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid PIN');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Caregiver Access
            </h1>
            <p className="text-gray-600">
              Enter your PIN to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                PIN Code
              </label>
              <div className="relative">
                <input
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || pin.length !== 4}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoading || pin.length !== 4
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Back to Activities
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Default PIN</h3>
            <p className="text-blue-700 text-sm">
              For demo purposes, use: <span className="font-mono font-bold">1234</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 