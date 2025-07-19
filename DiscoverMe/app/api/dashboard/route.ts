import { NextResponse } from 'next/server';
import { JSONStorage } from '@/lib/storage';
import { generateFeedback } from '@/lib/feedback-engine';
import { SessionData, ModuleEngagement, DashboardData } from '@/lib/types';

const storage = new JSONStorage();

export async function GET() {
  try {
    const sessions = await storage.getSessions();
    
    // Calculate engagement metrics
    const moduleEngagements = calculateEngagements(sessions);
    const topInterests = identifyTopInterests(sessions);
    const feedback = generateFeedback(sessions);
    
    const dashboardData: DashboardData = {
      sessions,
      moduleEngagements,
      topInterests,
      feedback,
      totalSessions: sessions.length,
      totalTime: sessions.reduce((sum, session) => sum + session.duration, 0)
    };
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Failed to generate dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to generate dashboard data' },
      { status: 500 }
    );
  }
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

function identifyTopInterests(sessions: SessionData[]): string[] {
  const moduleCounts: Record<string, number> = {};
  
  sessions.forEach(session => {
    moduleCounts[session.moduleId] = (moduleCounts[session.moduleId] || 0) + 1;
  });
  
  return Object.entries(moduleCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([moduleId]) => moduleId);
} 