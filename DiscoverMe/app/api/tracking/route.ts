import { NextRequest, NextResponse } from 'next/server';
import { JSONStorage } from '@/lib/storage';

const storage = new JSONStorage();

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json();
    await storage.saveSession(sessionData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save session:', error);
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sessions = await storage.getSessions();
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
} 