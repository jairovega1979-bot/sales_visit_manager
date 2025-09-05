

import { NextRequest, NextResponse } from 'next/server';
import { mockOffers } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    const now = new Date();
    let startDate: Date;
    let endDate: Date;
    let targetAmount: number;
    let periodName: string;

    // Calculer les dates et objectifs selon la période
    switch (period) {
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
        targetAmount = 2500000;
        periodName = `T${quarter + 1} ${now.getFullYear()}`;
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        targetAmount = 10000000;
        periodName = `${now.getFullYear()}`;
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        targetAmount = 850000;
        periodName = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        break;
    }

    // Récupérer toutes les offres depuis les données démo
    const allOffers = [...mockOffers];
    
    // Période précédente pour données historiques
    const previousPeriodStart = new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime()));
    
    // Filtrer les données historiques (période précédente + actuelle)
    const historicalOffers = allOffers.filter(offer => {
      const createdDate = new Date(offer.createdAt);
      return createdDate >= previousPeriodStart && createdDate <= endDate;
    });

    // Offres actuelles dans la période
    const currentOffers = historicalOffers.filter(offer => {
      const createdDate = new Date(offer.createdAt);
      return createdDate >= startDate && createdDate <= now;
    });

    // Offres gagnées dans la période
    const wonOffers = currentOffers.filter(offer => offer.status === 'WON');
    const actualSales = wonOffers.reduce((sum, offer) => sum + offer.amount, 0);

    // Offres en cours (pipeline)
    const pipelineOffers = currentOffers.filter(offer => 
      ['SENT', 'NEGOTIATION'].includes(offer.status)
    );

    // Calcul de prédiction basé sur plusieurs facteurs
    const daysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, daysInPeriod - daysPassed);

    // Facteur 1: Tendance historique
    const historicalWinRate = historicalOffers.length > 0 ? 
      historicalOffers.filter(o => o.status === 'WON').length / historicalOffers.length : 0.25;

    // Facteur 2: Pipeline pondéré par probabilité
    const weightedPipeline = pipelineOffers.reduce(
      (sum, offer) => sum + (offer.amount * (offer.probability / 100)), 0
    );

    // Facteur 3: Vitesse de progression actuelle
    const currentRunRate = daysPassed > 0 ? actualSales / daysPassed : 0;
    const projectedFromRunRate = currentRunRate * daysInPeriod;

    // Facteur 4: Saisonnalité (simulation)
    const seasonalityFactor = period === 'month' ? 
      (now.getMonth() === 11 ? 1.2 : now.getMonth() >= 5 && now.getMonth() <= 8 ? 0.8 : 1.0) : 1.0;

    // Calcul de prédiction hybride
    const pipelinePrediction = weightedPipeline * 0.6; // 60% de chance de fermer le pipeline pondéré
    const runRatePrediction = projectedFromRunRate * seasonalityFactor;
    
    const predicted = Math.round(
      actualSales + // Ventes déjà réalisées
      (pipelinePrediction * 0.4) + // 40% du pipeline pondéré
      (runRatePrediction * 0.3) + // 30% basé sur la tendance
      (targetAmount * 0.1 * (daysRemaining / daysInPeriod)) // 10% d'optimisme sur les jours restants
    );

    // Calcul du niveau de confiance
    const factorsAligned = Math.abs(pipelinePrediction - runRatePrediction) / Math.max(pipelinePrediction, runRatePrediction, 1);
    const confidence = Math.max(65, Math.min(95, 85 - (factorsAligned * 30)));

    // Facteurs d'influence pour l'analyse
    const factors = [
      {
        name: 'Pipeline actuel',
        impact: pipelineOffers.length > 0 ? 
          ((weightedPipeline / targetAmount) * 100 - 50) : -20
      },
      {
        name: 'Taux de conversion',
        impact: (historicalWinRate - 0.25) * 200
      },
      {
        name: 'Tendance mensuelle',
        impact: currentRunRate > (targetAmount / daysInPeriod) ? 15 : -10
      },
      {
        name: 'Facteur saisonnier',
        impact: (seasonalityFactor - 1) * 100
      },
      {
        name: 'Activité récente',
        impact: currentOffers.length > historicalOffers.length / 2 ? 10 : -15
      }
    ];

    // Recommandations basées sur l'analyse
    const recommendations = [];
    if (predicted < targetAmount * 0.8) {
      recommendations.push('Augmenter le nombre de prospects qualifiés');
      recommendations.push('Accélérer le processus de négociation');
    }
    if (pipelineOffers.length < 5) {
      recommendations.push('Développer le pipeline commercial');
    }
    if (historicalWinRate < 0.2) {
      recommendations.push('Améliorer la qualification des prospects');
    }

    return NextResponse.json({
      predicted,
      target: targetAmount,
      confidence: Math.round(confidence),
      period: periodName,
      variance: predicted - targetAmount,
      variancePercent: ((predicted - targetAmount) / targetAmount) * 100,
      factors: factors.map(f => ({
        ...f,
        impact: Math.round(f.impact * 10) / 10
      })),
      breakdown: {
        actualSales,
        pipelinePotential: Math.round(weightedPipeline),
        projectedFromTrend: Math.round(runRatePrediction),
        daysRemaining
      },
      recommendations,
      lastUpdated: now.toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du calcul des prédictions:', error);
    return NextResponse.json(
      { error: 'Erreur lors du calcul des prédictions' },
      { status: 500 }
    );
  }
}
