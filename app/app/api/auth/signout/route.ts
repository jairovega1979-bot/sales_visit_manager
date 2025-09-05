
import { NextRequest, NextResponse } from 'next/server';
import { AuthManager } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Déconnecter l'utilisateur
    AuthManager.logout();
    
    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie'
    });

  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
