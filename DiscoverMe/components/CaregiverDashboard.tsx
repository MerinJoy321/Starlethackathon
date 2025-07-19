'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  Lightbulb, 
  LogOut,
  Activity,
  Target,
  Award,
  Calendar,
  Users
} from 'lucide-react';
import { DashboardData, FeedbackInsight } from '@/lib/types';

export default function CaregiverDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getModuleName = (moduleId: string): string => {
    const names: Record<string, string> = {
      'art-pad': 'Art Pad',
      'puzzle-play': 'Puzzle Play',
      'music-maker': 'Music Maker',
      'math-explorer': 'Math Explorer',
      'builder-zone': 'Builder Zone'
    };
    return names[moduleId] || moduleId;
  };

  const getInsightIcon = (type: FeedbackInsight['type']) => {
    switch (type) {
      case 'engagement':
        return <Activity className="w-5 h-5" />;
      case 'preference':
        return <Target className="w-5 h-5" />;
      case 'development':
        return <TrendingUp className="w-5 h-5" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: FeedbackInsight['type']) => {
    switch (type) {
      case 'engagement':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'preference':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'development':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'recommendation':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Caregiver Dashboard</h1>
              <p className="text-gray-600">NeuroBloom Learning Analytics</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                View Activities
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Time</p>
                <p className="text-3xl font-bold text-gray-800">{formatTime(dashboardData.totalTime)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Session</p>
                <p className="text-3xl font-bold text-gray-800">
                  {dashboardData.totalSessions > 0 
                    ? formatTime(Math.round(dashboardData.totalTime / dashboardData.totalSessions))
                    : '0m'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Interest</p>
                <p className="text-3xl font-bold text-gray-800">
                  {dashboardData.topInterests.length > 0 
                    ? getModuleName(dashboardData.topInterests[0])
                    : 'None'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module Engagement */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Module Engagement</h2>
              
              {Object.entries(dashboardData.moduleEngagements).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(dashboardData.moduleEngagements)
                    .sort(([,a], [,b]) => b.sessionCount - a.sessionCount)
                    .map(([moduleId, engagement]) => (
                      <div key={moduleId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{getModuleName(moduleId)}</h3>
                            <p className="text-sm text-gray-600">
                              {engagement.sessionCount} sessions • {formatTime(engagement.totalTime)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800">
                            {Math.round(engagement.averageDuration / 60)}m avg
                          </p>
                          <p className="text-sm text-gray-600">
                            {engagement.averageInteractions} interactions
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No activity data yet</p>
                  <p className="text-sm">Start exploring activities to see engagement metrics</p>
                </div>
              )}
            </div>
          </div>

          {/* Insights */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">AI Insights</h2>
              
              {dashboardData.feedback.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.feedback.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{insight.title}</h3>
                          <p className="text-sm opacity-90">{insight.description}</p>
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-white/50 rounded-full h-2">
                                <div 
                                  className="bg-current h-2 rounded-full" 
                                  style={{ width: `${insight.confidence * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">
                                {Math.round(insight.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No insights yet</p>
                  <p className="text-sm">Complete more activities to get personalized insights</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
            
            {dashboardData.sessions.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.sessions
                  .sort((a, b) => b.startTimestamp.getTime() - a.startTimestamp.getTime())
                  .slice(0, 10)
                  .map((session) => (
                    <div key={session.sessionId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{getModuleName(session.moduleId)}</h3>
                          <p className="text-sm text-gray-600">
                            {formatTime(session.duration)} • {session.interactions} interactions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{formatDate(session.startTimestamp)}</p>
                        <div className="flex space-x-1 mt-1">
                          {session.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm">Activity will appear here once sessions are completed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 