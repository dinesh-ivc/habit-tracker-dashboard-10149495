import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Clear server-side session if using sessions
    // Note: For this implementation, we're clearing tokens on the client side via browser storage
    
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    );
  }
}