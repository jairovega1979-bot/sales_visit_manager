
// Demo signup API endpoint - No database dependencies
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, firstName, lastName, password } = body;

    // Demo mode - always return success without any database operations
    const responseUser = DEMO_USERS[0]; // Default to Pierre Martin
    
    return NextResponse.json({
      success: true,
      message: 'Inscription réussie en mode démonstration',
      user: {
        id: responseUser.id,
        email: responseUser.email,
        name: responseUser.name,
        role: responseUser.role
      },
      redirectUrl: '/dashboard'
    }, { status: 200 });
  } catch (error) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erreur de traitement' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'API Inscription - Mode Démonstration',
    availableUsers: DEMO_USERS.map(u => ({
      email: u.email,
      name: u.name,
      role: u.role,
      territory: u.territory || 'Non défini'
    }))
  });
}
