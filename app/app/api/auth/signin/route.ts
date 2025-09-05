
import { NextRequest, NextResponse } from 'next/server';
import { demoUsers, AuthManager } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Chercher l'utilisateur demo correspondant
    const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Connecter l'utilisateur
    const loggedInUser = AuthManager.login(email);
    
    if (!loggedInUser) {
      return NextResponse.json(
        { error: 'Erreur lors de la connexion' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: loggedInUser.id,
        email: loggedInUser.email,
        name: loggedInUser.name,
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        role: loggedInUser.role,
        territory: loggedInUser.territory
      }
    });

  } catch (error) {
    console.error('Erreur de connexion:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
