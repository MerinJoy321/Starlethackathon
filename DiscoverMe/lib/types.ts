export interface SessionData {
  sessionId: string;
  moduleId: string;
  startTimestamp: Date;
  endTimestamp: Date;
  duration: number; // in seconds
  interactions: number;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface ModuleEngagement {
  sessionCount: number;
  totalTime: number;
  totalInteractions: number;
  averageDuration: number;
  averageInteractions: number;
}

export interface DashboardData {
  sessions: SessionData[];
  moduleEngagements: Record<string, ModuleEngagement>;
  topInterests: string[];
  feedback: FeedbackInsight[];
  totalSessions: number;
  totalTime: number;
}

export interface FeedbackInsight {
  type: 'engagement' | 'preference' | 'development' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  data?: any;
}

export interface ActivityModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'creative' | 'cognitive' | 'social' | 'physical';
}

export interface TrackingEvent {
  type: 'click' | 'drag' | 'complete' | 'error' | 'pause' | 'resume';
  timestamp: Date;
  element?: string;
  data?: any;
} 