
export type Period = 'week' | 'month' | 'year';
export type Status = 'success' | 'warning' | 'danger';

export interface SalesObjective {
  id: string;
  period: Period;
  startDate: Date;
  endDate: Date;
  target: number;
  actual: number;
  forecast: number;
  previousPeriodActual: number;
  salesCount: number;
  appointmentsCount: number;
  margin?: number;
  currency: string;
  team?: string;
  salesperson?: string;
  region?: string;
  productLine?: string;
  channel?: string;
}

export interface SalesTrend {
  date: Date;
  value: number;
  period: Period;
}

export interface SalesMetrics {
  completionPercentage: number;
  status: Status;
  variationAbsolute: number;
  variationPercentage: number;
  projectedCompletion: number;
  gapAmount: number;
  recommendedActions: string[];
  daysRemaining: number;
  averageDailyTarget: number;
  averageDailyActual: number;
}

export interface FilterOptions {
  teams: string[];
  salespeople: string[];
  regions: string[];
  productLines: string[];
  channels: string[];
}

export class SalesObjectiveCalculator {
  static calculateMetrics(objective: SalesObjective): SalesMetrics {
    const completionPercentage = Math.round((objective.actual / objective.target) * 100);
    const status: Status = completionPercentage >= 100 ? 'success' : 
                          completionPercentage >= 85 ? 'warning' : 'danger';
    
    const variationAbsolute = objective.actual - objective.previousPeriodActual;
    const variationPercentage = objective.previousPeriodActual > 0 
      ? Math.round(((objective.actual - objective.previousPeriodActual) / objective.previousPeriodActual) * 100)
      : 0;
    
    const projectedCompletion = Math.round((objective.forecast / objective.target) * 100);
    const gapAmount = Math.max(0, objective.target - objective.forecast);
    
    const now = new Date();
    const totalDays = Math.ceil((objective.endDate.getTime() - objective.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((now.getTime() - objective.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - elapsedDays);
    
    const averageDailyTarget = objective.target / totalDays;
    const averageDailyActual = elapsedDays > 0 ? objective.actual / elapsedDays : 0;
    
    const recommendedActions = this.generateRecommendations(
      completionPercentage, 
      gapAmount, 
      daysRemaining,
      objective.appointmentsCount,
      objective.period
    );

    return {
      completionPercentage,
      status,
      variationAbsolute,
      variationPercentage,
      projectedCompletion,
      gapAmount,
      recommendedActions,
      daysRemaining,
      averageDailyTarget,
      averageDailyActual
    };
  }

  private static generateRecommendations(
    completion: number, 
    gap: number, 
    daysRemaining: number,
    appointmentsCount: number,
    period: Period
  ): string[] {
    const recommendations: string[] = [];
    
    if (completion < 85) {
      recommendations.push(`Écart critique: ${gap.toLocaleString('fr-CH')} CHF à rattraper`);
      
      if (period === 'week' && daysRemaining > 0) {
        const additionalMeetings = Math.ceil(gap / 15000); // Assume 15k average per meeting
        recommendations.push(`Programmer ${additionalMeetings} rendez-vous urgents`);
      } else if (period === 'month' && daysRemaining > 7) {
        const additionalMeetings = Math.ceil(gap / 12000);
        recommendations.push(`Planifier ${additionalMeetings} rendez-vous ce mois`);
      }
      
      recommendations.push('Revoir la stratégie de prospection');
      recommendations.push('Activer les clients dormants');
    } else if (completion < 100) {
      recommendations.push(`Dernière ligne droite: ${gap.toLocaleString('fr-CH')} CHF restants`);
      recommendations.push('Accélérer la négociation des offres en cours');
      
      if (appointmentsCount < 10) {
        recommendations.push('Intensifier les rendez-vous qualifiés');
      }
    } else {
      recommendations.push('Objectif atteint ! Maintenir l\'élan');
      recommendations.push('Préparer les objectifs de la période suivante');
    }

    return recommendations;
  }
}

// Mock data generator
export function generateMockSalesObjectives(salesperson?: string): SalesObjective[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentWeek = getWeekNumber(now);

  const objectives: SalesObjective[] = [];

  // Use provided salesperson or default
  const targetSalesperson = salesperson || 'Pierre Martin';

  // Weekly objectives
  const weekStart = getMonday(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  objectives.push({
    id: `week-current-${targetSalesperson.toLowerCase().replace(/\s+/g, '-')}`,
    period: 'week',
    startDate: weekStart,
    endDate: weekEnd,
    target: 50000,
    actual: 38500,
    forecast: 47000,
    previousPeriodActual: 35000,
    salesCount: 4,
    appointmentsCount: 8,
    margin: 15400,
    currency: 'CHF',
    team: 'Equipe Genève',
    salesperson: targetSalesperson,
    region: 'Suisse Romande',
    productLine: 'CRM Enterprise',
    channel: 'Direct'
  });

  // Monthly objectives
  const monthStart = new Date(currentYear, currentMonth, 1);
  const monthEnd = new Date(currentYear, currentMonth + 1, 0);

  objectives.push({
    id: `month-current-${targetSalesperson.toLowerCase().replace(/\s+/g, '-')}`,
    period: 'month',
    startDate: monthStart,
    endDate: monthEnd,
    target: 200000,
    actual: 165000,
    forecast: 185000,
    previousPeriodActual: 150000,
    salesCount: 15,
    appointmentsCount: 32,
    margin: 66000,
    currency: 'CHF',
    team: 'Equipe Genève',
    salesperson: targetSalesperson,
    region: 'Suisse Romande',
    productLine: 'CRM Enterprise',
    channel: 'Direct'
  });

  // Yearly objectives
  const yearStart = new Date(currentYear, 0, 1);
  const yearEnd = new Date(currentYear, 11, 31);

  objectives.push({
    id: `year-current-${targetSalesperson.toLowerCase().replace(/\s+/g, '-')}`,
    period: 'year',
    startDate: yearStart,
    endDate: yearEnd,
    target: 2400000,
    actual: 1850000,
    forecast: 2200000,
    previousPeriodActual: 1650000,
    salesCount: 145,
    appointmentsCount: 320,
    margin: 740000,
    currency: 'CHF',
    team: 'Equipe Genève',
    salesperson: targetSalesperson,
    region: 'Suisse Romande',
    productLine: 'CRM Enterprise',
    channel: 'Direct'
  });

  return objectives;
}

export function generateMockSalesTrends(period: Period): SalesTrend[] {
  const trends: SalesTrend[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    let value: number;
    
    if (period === 'week') {
      date.setDate(date.getDate() - (i * 7));
      value = 30000 + (Math.random() * 40000) + (i * 2000); // Trending up
    } else if (period === 'month') {
      date.setMonth(date.getMonth() - i);
      value = 120000 + (Math.random() * 160000) + (i * 8000); // Trending up
    } else {
      date.setFullYear(date.getFullYear() - i);
      value = 1800000 + (Math.random() * 800000) + (i * 50000); // Trending up
    }
    
    trends.push({
      date,
      value: Math.round(value),
      period
    });
  }
  
  return trends;
}

export function getMockFilterOptions(isManager: boolean = false, currentUser?: string): FilterOptions {
  const baseOptions = {
    teams: ['Toutes les équipes', 'Équipe Genève', 'Équipe Zurich', 'Équipe Bâle', 'Équipe Lausanne'],
    salespeople: isManager 
      ? ['Tous les vendeurs', 'Pierre Martin', 'Marie Dubois', 'Jean-Claude Weber', 'Sarah Müller', 'David Rossi']
      : currentUser ? [currentUser] : ['Pierre Martin'], // Only current user for sales reps
    regions: ['Toutes les régions', 'Suisse Romande', 'Suisse Allemande', 'Suisse Italienne', 'Ticino'],
    productLines: ['Toutes les lignes', 'CRM Enterprise', 'Solutions BI', 'Consulting Digital', 'Formation', 'Support Premium'],
    channels: ['Tous les canaux', 'Direct', 'Partenaires', 'Online', 'Distributeurs', 'Retail']
  };

  return baseOptions;
}

// Utility functions
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getMonday(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

// Team objectives for managers
export function generateTeamObjectives(): SalesObjective[] {
  const baseObjectives = generateMockSalesObjectives();
  const teamObjectives: SalesObjective[] = [];

  // Aggregate team data
  const teams = ['Équipe Genève', 'Équipe Zurich', 'Équipe Bâle'];
  
  teams.forEach((team, index) => {
    baseObjectives.forEach(objective => {
      teamObjectives.push({
        ...objective,
        id: `${objective.id}-${team.toLowerCase().replace(/\s+/g, '-')}`,
        team,
        target: objective.target * (1.2 + index * 0.3), // Different targets per team
        actual: objective.actual * (0.8 + index * 0.4),
        forecast: objective.forecast * (0.9 + index * 0.3),
        previousPeriodActual: objective.previousPeriodActual * (0.7 + index * 0.5),
        salesCount: objective.salesCount * (1 + index),
        appointmentsCount: objective.appointmentsCount * (1 + index),
        margin: objective.margin ? objective.margin * (0.9 + index * 0.2) : undefined
      });
    });
  });

  return teamObjectives;
}
