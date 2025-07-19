import { NextResponse } from 'next/server';
import { JSONStorage } from '@/lib/storage';
import { generateFeedback } from '@/lib/feedback-engine';

const storage = new JSONStorage();

export async function GET() {
  try {
    const sessions = await storage.getSessions();
    const feedback = generateFeedback(sessions);
    
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Failed to generate feedback:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
} 