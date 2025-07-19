import { SessionData, FeedbackInsight, ModuleEngagement } from './types';

export function generateFeedback(sessions: SessionData[]): FeedbackInsight[] {
  const insights: FeedbackInsight[] = [];
  
  if (sessions.length === 0) {
    insights.push({
      type: 'recommendation',
      title: 'Welcome to NeuroBloom!',
      description: 'Start exploring activities to see personalized insights about your learning journey.',
      confidence: 1.0
    });
    return insights;
  }

  // Calculate engagement patterns
  const moduleEngagements = calculateEngagements(sessions);
  const totalSessions = sessions.length;
  const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);
  const averageSessionTime = totalTime / totalSessions;

  // Engagement insights
  if (averageSessionTime > 300) { // 5 minutes
    insights.push({
      type: 'engagement',
      title: 'Excellent Focus!',
      description: `You're spending an average of ${Math.round(averageSessionTime / 60)} minutes per session, showing great concentration.`,
      confidence: 0.9,
      data: { averageSessionTime }
    });
  } else if (averageSessionTime < 60) {
    insights.push({
      type: 'engagement',
      title: 'Quick Learner',
      description: 'You complete activities quickly! Consider trying more complex challenges.',
      confidence: 0.8,
      data: { averageSessionTime }
    });
  }

  // Module preference insights
  const topModules = Object.entries(moduleEngagements)
    .sort(([,a], [,b]) => b.sessionCount - a.sessionCount)
    .slice(0, 3);

  if (topModules.length > 0) {
    const [topModuleId, topModule] = topModules[0];
    const moduleNames: Record<string, string> = {
      'art-pad': 'Art Pad',
      'puzzle-play': 'Puzzle Play',
      'music-maker': 'Music Maker',
      'math-explorer': 'Math Explorer',
      'builder-zone': 'Builder Zone'
    };

    insights.push({
      type: 'preference',
      title: 'Favorite Activity',
      description: `You love ${moduleNames[topModuleId] || topModuleId}! You've played it ${topModule.sessionCount} times.`,
      confidence: 0.85,
      data: { topModule: topModuleId, sessionCount: topModule.sessionCount }
    });
  }

  // Development insights
  const recentSessions = sessions
    .sort((a, b) => b.startTimestamp.getTime() - a.startTimestamp.getTime())
    .slice(0, 5);

  if (recentSessions.length >= 3) {
    const recentAvgTime = recentSessions.reduce((sum, session) => sum + session.duration, 0) / recentSessions.length;
    const olderSessions = sessions.slice(0, Math.max(0, sessions.length - 5));
    const olderAvgTime = olderSessions.length > 0 
      ? olderSessions.reduce((sum, session) => sum + session.duration, 0) / olderSessions.length
      : 0;

    if (recentAvgTime > olderAvgTime * 1.2) {
      insights.push({
        type: 'development',
        title: 'Growing Engagement',
        description: 'Your recent sessions are longer, showing increased interest and focus!',
        confidence: 0.8,
        data: { recentAvgTime, olderAvgTime }
      });
    }
  }

  // Interaction pattern insights
  const highInteractionSessions = sessions.filter(s => s.interactions > 20);
  if (highInteractionSessions.length > sessions.length * 0.7) {
    insights.push({
      type: 'engagement',
      title: 'Active Explorer',
      description: 'You interact extensively with activities, showing curiosity and engagement!',
      confidence: 0.9,
      data: { highInteractionRatio: highInteractionSessions.length / sessions.length }
    });
  }

  // Recommendation insights
  const playedModules = new Set(sessions.map(s => s.moduleId));
  const allModules = ['art-pad', 'puzzle-play', 'music-maker', 'math-explorer', 'builder-zone'];
  const unplayedModules = allModules.filter(m => !playedModules.has(m));

  if (unplayedModules.length > 0) {
    const moduleNames: Record<string, string> = {
      'art-pad': 'Art Pad',
      'puzzle-play': 'Puzzle Play',
      'music-maker': 'Music Maker',
      'math-explorer': 'Math Explorer',
      'builder-zone': 'Builder Zone'
    };

    insights.push({
      type: 'recommendation',
      title: 'Try Something New',
      description: `Explore ${moduleNames[unplayedModules[0]]} for a different type of challenge!`,
      confidence: 0.7,
      data: { recommendedModule: unplayedModules[0] }
    });
  }

  return insights;
}

function calculateEngagements(sessions: SessionData[]): Record<string, ModuleEngagement> {
  const engagements: Record<string, ModuleEngagement> = {};
  
  sessions.forEach(session => {
    if (!engagements[session.moduleId]) {
      engagements[session.moduleId] = {
        sessionCount: 0,
        totalTime: 0,
        totalInteractions: 0,
        averageDuration: 0,
        averageInteractions: 0
      };
    }
    
    engagements[session.moduleId].sessionCount++;
    engagements[session.moduleId].totalTime += session.duration;
    engagements[session.moduleId].totalInteractions += session.interactions;
  });

  // Calculate averages
  Object.values(engagements).forEach(engagement => {
    engagement.averageDuration = engagement.totalTime / engagement.sessionCount;
    engagement.averageInteractions = engagement.totalInteractions / engagement.sessionCount;
  });
  
  return engagements;
} 