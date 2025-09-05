
// Demo authentication API endpoints - simplified
import { NextRequest, NextResponse } from 'next/server';

// Hardcoded demo users to avoid any database calls
const DEMO_USERS = [
  {
    id: 'cmevym6140001pzulv86ez0zx',
    email: 'pierre@birdlogyc.com',
    name: 'Pierre Martin',
    firstName: 'Pierre',
    lastName: 'Martin',
    role: 'MANAGER',
    territory: 'Suisse Romande'
  },
  {
    id: 'cmevym6120000pzultnfb7d49',
    email: 'manager@birdlogyc.com', 
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'MANAGER',
    territory: 'Suisse Romande'
  },
  {
    id: 'cmevym6160002pzulln8nonnp',
    email: 'marie@birdlogyc.com',
    name: 'Marie Dubois',
    firstName: 'Marie',
    lastName: 'Dubois',
    role: 'SALES_REP',
    territory: 'Lausanne'
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') || 'providers';

  console.log('NextAuth API GET called with action:', action);

  switch (action) {
    case 'providers':
      return NextResponse.json({
        demo: {
          id: 'demo',
          name: 'Mode Démonstration',
          type: 'credentials'
        }
      }, { status: 200 });

    case 'session':
      return NextResponse.json({
        user: null,
        expires: null
      }, { status: 200 });

    case 'csrf':
      return NextResponse.json({ 
        csrfToken: 'demo-csrf-token-' + Date.now() 
      }, { status: 200 });

    default:
      return NextResponse.json({ 
        message: 'Mode démonstration activé',
        availableUsers: DEMO_USERS.map(u => ({ 
          email: u.email, 
          name: u.name,
          role: u.role 
        }))
      }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  console.log('NextAuth API POST called');

  try {
    const body = await req.json();
    console.log('POST body received:', body);

    return NextResponse.json({
      success: true,
      message: 'Demo mode - authentication handled client-side'
    }, { status: 200 });

  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json({ 
      error: 'Erreur de traitement',
      success: false 
    }, { status: 500 });
  }
}
