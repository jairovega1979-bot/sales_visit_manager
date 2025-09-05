
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Providers endpoint called');
  
  return NextResponse.json({
    demo: {
      id: 'demo',
      name: 'Mode Démonstration',
      type: 'credentials',
      signinUrl: '/auth/signin',
      callbackUrl: '/dashboard'
    }
  }, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
