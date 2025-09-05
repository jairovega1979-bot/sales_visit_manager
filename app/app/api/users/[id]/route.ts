

import { NextRequest, NextResponse } from 'next/server';
import { demoUsers } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/users/[id] - Récupérer un utilisateur spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = demoUsers.find(u => u.id === params.id);

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Retourner seulement les champs publics
    const publicUser = {
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      territory: user.territory
    };

    return NextResponse.json(publicUser);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Mettre à jour un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { role, territory } = body;

    // En mode démo, nous ne modifions pas réellement les utilisateurs
    // Retourner l'utilisateur actuel avec les changements simulés
    const user = demoUsers.find(u => u.id === params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const updatedUser = {
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: role || user.role,
      territory: territory || user.territory
    };

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    );
  }
}
