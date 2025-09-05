

import { NextRequest, NextResponse } from 'next/server';
import { demoState } from '@/lib/demo-state';

export const dynamic = 'force-dynamic';

// GET /api/prospects/[id] - Récupérer un prospect spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const manager = demoState.getManager();
    const prospect = manager.getProspectById(params.id);

    if (!prospect) {
      return NextResponse.json(
        { error: 'Prospect non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(prospect);
  } catch (error) {
    console.error('Erreur lors de la récupération du prospect:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du prospect' },
      { status: 500 }
    );
  }
}

// PUT /api/prospects/[id] - Mettre à jour un prospect
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const manager = demoState.getManager();
    
    const updatedProspect = manager.updateProspect(params.id, body);
    
    if (!updatedProspect) {
      return NextResponse.json(
        { error: 'Prospect non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProspect);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du prospect:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du prospect' },
      { status: 500 }
    );
  }
}

// DELETE /api/prospects/[id] - Supprimer un prospect
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const manager = demoState.getManager();
    const deletedProspect = manager.deleteProspect(params.id);
    
    if (!deletedProspect) {
      return NextResponse.json(
        { error: 'Prospect non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Prospect supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du prospect:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du prospect' },
      { status: 500 }
    );
  }
}
