

import { NextRequest, NextResponse } from 'next/server';
import { mockOffers } from '@/lib/mock-data';

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

    // Récupérer toutes les offres depuis les données démo
    const allOffers = [...mockOffers];
    
    // Filtrer les offres dans la période
    const offers = allOffers.filter(offer => {
      const createdDate = new Date(offer.createdAt);
      return createdDate >= startDate && createdDate <= now;
    });

    // Définir les étapes de l'entonnoir avec leurs couleurs
    const funnelStages = [
      { 
        stage: 'Prospects Qualifiés', 
        statuses: ['DRAFT', 'SENT', 'NEGOTIATION', 'WON', 'LOST', 'EXPIRED'],
        fill: '#1e3a8a'
      },
      { 
        stage: 'Propositions Envoyées', 
        statuses: ['SENT', 'NEGOTIATION', 'WON'],
        fill: '#3b82f6'
      },
      { 
        stage: 'En Négociation', 
        statuses: ['NEGOTIATION', 'WON'],
        fill: '#60a5fa'
      },
      { 
        stage: 'Affaires Gagnées', 
        statuses: ['WON'],
        fill: '#059669'
      }
    ];

    const totalOffers = offers.length;

    // Calculer les données pour chaque étape
    const funnelData = funnelStages.map(stage => {
      const stageOffers = offers.filter(offer => stage.statuses.includes(offer.status));
      const count = stageOffers.length;
      const value = stageOffers.reduce((sum, offer) => sum + offer.amount, 0);
      const percentage = totalOffers > 0 ? (count / totalOffers) * 100 : 0;

      return {
        stage: stage.stage,
        count,
        value,
        percentage,
        fill: stage.fill,
        averageDealSize: count > 0 ? value / count : 0
      };
    });

    // Calculer les métriques de conversion
    const conversionRates = {
      prospectToProposal: funnelData[0].count > 0 ? 
        (funnelData[1].count / funnelData[0].count) * 100 : 0,
      proposalToNegotiation: funnelData[1].count > 0 ? 
        (funnelData[2].count / funnelData[1].count) * 100 : 0,
      negotiationToWon: funnelData[2].count > 0 ? 
        (funnelData[3].count / funnelData[2].count) * 100 : 0,
      overallConversion: funnelData[0].count > 0 ? 
        (funnelData[3].count / funnelData[0].count) * 100 : 0
    };

    // Calculs supplémentaires
    const averageDealValue = totalOffers > 0 ? 
      offers.reduce((sum, offer) => sum + offer.amount, 0) / totalOffers : 0;
    
    const projectedRevenue = offers
      .filter(offer => ['SENT', 'NEGOTIATION'].includes(offer.status))
      .reduce((sum, offer) => sum + (offer.amount * (offer.probability / 100)), 0);

    return NextResponse.json({
      funnel: funnelData,
      conversionRates,
      metrics: {
        totalProspects: totalOffers,
        averageDealValue,
        projectedRevenue,
        winRate: conversionRates.overallConversion
      },
      period,
      lastUpdated: now.toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'entonnoir:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'entonnoir' },
      { status: 500 }
    );
  }
}
