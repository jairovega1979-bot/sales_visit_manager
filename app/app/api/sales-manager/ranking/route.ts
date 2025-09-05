

import { NextRequest, NextResponse } from 'next/server';
import { mockUsers, mockOffers, mockVisits } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // Calculer les dates selon la période
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    // Récupérer toutes les données depuis les mock data
    const allUsers = [...mockUsers];
    const allOffers = [...mockOffers];
    const allVisits = [...mockVisits];

    // Filtrer les commerciaux
    const salesReps = allUsers.filter(user => user.role === 'SALES_REP');

    // Filtrer les offres et visites dans la période
    const periodOffers = allOffers.filter(offer => {
      const updatedDate = new Date(offer.updatedAt);
      return updatedDate >= startDate && updatedDate <= now;
    });

    const periodVisits = allVisits.filter(visit => {
      if (!visit.actualDate) return false;
      const actualDate = new Date(visit.actualDate);
      return actualDate >= startDate && actualDate <= now;
    });

    // Calculer les performances de chaque commercial
    const performances = salesReps.map((rep, index) => {
      // Filtrer les offres de ce commercial dans la période
      const repOffers = periodOffers.filter(offer => offer.assignedUserId === rep.id);
      const wonOffers = repOffers.filter(offer => offer.status === 'WON');
      const actualSales = wonOffers.reduce((sum, offer) => sum + offer.amount, 0);
      
      // Objectifs individuels basés sur la période
      const targetSales = period === 'month' ? 170000 : 
                         period === 'quarter' ? 500000 : 
                         2000000;
      
      const totalOffers = repOffers.length;
      const conversionRate = totalOffers > 0 ? (wonOffers.length / totalOffers) * 100 : 0;
      
      // Simuler une tendance basée sur les performances récentes
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const recentOffers = repOffers.filter(offer => {
        const offerDate = new Date(offer.updatedAt);
        return offerDate >= twoWeeksAgo;
      });
      
      const trend = recentOffers.length > repOffers.length * 0.3 ? 'up' : 
                   recentOffers.length < repOffers.length * 0.1 ? 'down' : 'stable';

      return {
        id: rep.id,
        name: rep.name || `${rep.firstName} ${rep.lastName}`,
        actualSales,
        targetSales,
        deals: totalOffers,
        conversionRate,
        trend: trend as 'up' | 'down' | 'stable',
        performance: (actualSales / targetSales) * 100
      };
    });

    // Trier par ventes actuelles et assigner les rangs
    const sortedPerformances = performances
      .sort((a, b) => b.actualSales - a.actualSales)
      .map((perf, index) => ({
        ...perf,
        rank: index + 1
      }));

    return NextResponse.json({
      salesReps: sortedPerformances,
      period,
      lastUpdated: now.toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du classement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du classement' },
      { status: 500 }
    );
  }
}
