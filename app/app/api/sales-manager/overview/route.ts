

import { NextRequest, NextResponse } from 'next/server';
import { mockOffers } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // Calculer les dates de début et fin selon la période
    const now = new Date();
    let startDate: Date;
    let targetAmount: number;

    switch (period) {
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        targetAmount = 2500000; // Objectif trimestriel: 2.5M CHF
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        targetAmount = 10000000; // Objectif annuel: 10M CHF
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        targetAmount = 850000; // Objectif mensuel: 850k CHF
        break;
    }

    // Récupérer toutes les offres depuis les données démo
    const allOffers = [...mockOffers];
    
    // Filtrer les offres gagnées dans la période
    const wonOffers = allOffers.filter(offer => {
      if (offer.status !== 'WON') return false;
      
      const updatedDate = new Date(offer.updatedAt);
      return updatedDate >= startDate && updatedDate <= now;
    });

    // Calculer les ventes actuelles
    const actualSales = wonOffers.reduce((sum, offer) => sum + offer.amount, 0);
    
    // Calculer la progression (%)
    const progression = Math.min((actualSales / targetAmount) * 100, 100);
    
    // Calculer la variance (%)
    const variance = ((actualSales - targetAmount) / targetAmount) * 100;

    // Données de tendance (simulation basée sur les données réelles)
    const daysInPeriod = period === 'month' ? 30 : period === 'quarter' ? 90 : 365;
    const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const expectedProgress = (daysPassed / daysInPeriod) * 100;

    const response = {
      actualSales,
      targetSales: targetAmount,
      progression,
      variance,
      trend: {
        expected: expectedProgress,
        actual: progression,
        isAhead: progression > expectedProgress
      },
      period,
      lastUpdated: now.toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des données de vue d\'ensemble:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}
