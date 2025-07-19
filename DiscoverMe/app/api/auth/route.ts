import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CAREGIVER_PIN = process.env.CAREGIVER_PIN || '1234';

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();
    
    if (pin === CAREGIVER_PIN) {
      // Set a simple session cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set('caregiver-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      
      return response;
    }
    
    return NextResponse.json(
      { error: 'Invalid PIN' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Authentication failed:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.set('caregiver-auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    });
    
    return response;
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
} 