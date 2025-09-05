

import { NextRequest, NextResponse } from 'next/server';
import { demoUsers } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/users - Récupérer la liste des utilisateurs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const role = searchParams.get('role');

    // Récupérer tous les utilisateurs depuis les données démo
    let users = [...demoUsers];
    
    // Filtrer par rôle si spécifié
    if (role) {
      users = users.filter(user => user.role === role);
    }

    // Limiter le nombre de résultats si spécifié
    if (limit) {
      const limitNum = parseInt(limit);
      users = users.slice(0, limitNum);
    }

    // Retourner seulement les champs nécessaires
    const filteredUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      territory: user.territory
    }));

    return NextResponse.json({
      users: filteredUsers,
      count: filteredUsers.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}
