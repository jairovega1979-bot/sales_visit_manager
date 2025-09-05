


import { NextRequest, NextResponse } from 'next/server';
import { mockProspects } from '@/lib/mock-data';
import { demoState } from '@/lib/demo-state';

export const dynamic = 'force-dynamic';

// GET /api/prospects - Récupérer tous les prospects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const priority = searchParams.get('priority') as any;
    const source = searchParams.get('source') as any;
    const industry = searchParams.get('industry');
    const location = searchParams.get('location');
    const minFitScore = searchParams.get('minFitScore');
    const maxFitScore = searchParams.get('maxFitScore');

    const manager = demoState.getManager();
    
    // Apply filters if provided
    const filters: any = {};
    if (priority) filters.priority = priority;
    if (source) filters.source = source;
    if (industry) filters.industry = industry;
    if (location) filters.location = location;
    if (minFitScore) filters.minFitScore = parseInt(minFitScore);
    if (maxFitScore) filters.maxFitScore = parseInt(maxFitScore);

    const prospects = Object.keys(filters).length > 0 
      ? manager.searchProspects(filters)
      : manager.getProspects().filter(p => !p.isConverted);

    const stats = manager.getProspectsStats();

    return NextResponse.json({
      prospects,
      count: prospects.length,
      stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des prospects:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des prospects' },
      { status: 500 }
    );
  }
}

// POST /api/prospects - Ajouter un nouveau prospect
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const manager = demoState.getManager();

    // Check for duplicates
    if (!manager.deduplicateProspect(body)) {
      return NextResponse.json(
        { error: 'Ce prospect existe déjà comme client' },
        { status: 409 }
      );
    }

    const newProspect = manager.addProspect({
      ...body,
      discoveredAt: new Date().toISOString(),
      lastResearched: new Date().toISOString(),
      isConverted: false
    });

    return NextResponse.json(newProspect, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du prospect:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du prospect' },
      { status: 500 }
    );
  }
}
