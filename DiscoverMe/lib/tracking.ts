import { TrackingEvent, SessionData } from './types';

export class SessionTracker {
  private sessionId: string;
  private moduleId: string;
  private startTime: Date;
  private events: TrackingEvent[] = [];
  private interactionCount = 0;

  constructor(moduleId: string) {
    this.sessionId = this.generateSessionId();
    this.moduleId = moduleId;
    this.startTime = new Date();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  trackEvent(type: TrackingEvent['type'], element?: string, data?: any) {
    const event: TrackingEvent = {
      type,
      timestamp: new Date(),
      element,
      data
    };

    this.events.push(event);
    
    // Count interactions
    if (['click', 'drag', 'complete'].includes(type)) {
      this.interactionCount++;
    }
  }

  async endSession(): Promise<SessionData> {
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - this.startTime.getTime()) / 1000);

    const sessionData: SessionData = {
      sessionId: this.sessionId,
      moduleId: this.moduleId,
      startTimestamp: this.startTime,
      endTimestamp: endTime,
      duration,
      interactions: this.interactionCount,
      tags: this.generateTags(),
      metadata: {
        events: this.events,
        eventCount: this.events.length
      }
    };

    // Send to API
    try {
      await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });
    } catch (error) {
      console.error('Failed to save session:', error);
    }

    return sessionData;
  }

  private generateTags(): string[] {
    const tags: string[] = [];
    
    // Add tags based on events
    const eventTypes = this.events.map(e => e.type);
    
    if (eventTypes.includes('complete')) {
      tags.push('completed');
    }
    
    if (eventTypes.includes('error')) {
      tags.push('had-errors');
    }
    
    if (eventTypes.includes('pause')) {
      tags.push('paused');
    }
    
    if (this.interactionCount > 50) {
      tags.push('high-interaction');
    } else if (this.interactionCount < 10) {
      tags.push('low-interaction');
    }

    return tags;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getInteractionCount(): number {
    return this.interactionCount;
  }
}

// Global tracking instance
let currentTracker: SessionTracker | null = null;

export function startTracking(moduleId: string): SessionTracker {
  if (currentTracker) {
    console.warn('Session already in progress, ending previous session');
    currentTracker.endSession();
  }
  
  currentTracker = new SessionTracker(moduleId);
  return currentTracker;
}

export function getCurrentTracker(): SessionTracker | null {
  return currentTracker;
}

export function endCurrentSession(): Promise<SessionData | null> {
  if (currentTracker) {
    const tracker = currentTracker;
    currentTracker = null;
    return tracker.endSession();
  }
  return Promise.resolve(null);
}

// Utility functions for common tracking patterns
export function trackClick(element: string, data?: any) {
  if (currentTracker) {
    currentTracker.trackEvent('click', element, data);
  }
}

export function trackDrag(element: string, data?: any) {
  if (currentTracker) {
    currentTracker.trackEvent('drag', element, data);
  }
}

export function trackComplete(data?: any) {
  if (currentTracker) {
    currentTracker.trackEvent('complete', undefined, data);
  }
}

export function trackError(element: string, error: any) {
  if (currentTracker) {
    currentTracker.trackEvent('error', element, { error: error.message || error });
  }
} 