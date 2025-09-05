

import { NextRequest, NextResponse } from 'next/server';
import { demoState } from '@/lib/demo-state';

export const dynamic = 'force-dynamic';

// POST /api/prospects/[id]/convert - Convertir prospect en client
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const manager = demoState.getManager();
    const newCustomer = manager.convertProspectToCustomer(params.id);
    
    if (!newCustomer) {
      return NextResponse.json(
        { error: 'Prospect non trouvé ou déjà converti' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Prospect converti en client avec succès',
      customer: newCustomer
    });
  } catch (error) {
    console.error('Erreur lors de la conversion du prospect:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la conversion du prospect' },
      { status: 500 }
    );
  }
}
