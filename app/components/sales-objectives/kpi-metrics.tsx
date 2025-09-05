
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Euro,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { SalesObjective, SalesMetrics, SalesObjectiveCalculator, Period } from '@/lib/sales-objectives';
import { Sparkline } from './sparkline';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface KPIMetricsProps {
  objective: SalesObjective;
  trends: any[];
  period: Period;
  className?: string;
}

export function KPIMetrics({ objective, trends, period, className = '' }: KPIMetricsProps) {
  const metrics = SalesObjectiveCalculator.calculateMetrics(objective);
  
  const periodLabel = {
    week: 'Cette semaine',
    month: 'Ce mois',
    year: 'Cette année'
  }[period];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'danger': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <Clock className="h-4 w-4" />;
      case 'danger': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 85) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Euro className="h-4 w-4" />
              CA {periodLabel}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Chiffre d'affaires réalisé vs objectif fixé</p>
                    <p>Mise à jour quotidienne à 08:00</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(objective.actual)}
              </span>
              <span className="text-sm text-gray-500">
                / {formatCurrency(objective.target)}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progression</span>
                <span className="font-medium">{metrics.completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metrics.completionPercentage)}`}
                  style={{ width: `${Math.min(metrics.completionPercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Status Badge */}
            <Badge className={`${getStatusColor(metrics.status)} text-xs font-medium`}>
              {getStatusIcon(metrics.status)}
              <span className="ml-1">
                {metrics.status === 'success' ? 'Objectif atteint' : 
                 metrics.status === 'warning' ? 'Attention requise' : 
                 'Action urgente'}
              </span>
            </Badge>

            {/* Sparkline */}
            <div className="mt-3">
              <div className="text-xs text-gray-500 mb-1">Tendance (12 dernières périodes)</div>
              <Sparkline data={trends} width={200} height={30} />
            </div>
          </CardContent>
        </Card>

        {/* Forecast Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Prévision de clôture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(objective.forecast)}
              </span>
              <span className="text-sm text-gray-500">
                ({metrics.projectedCompletion}%)
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Écart à l'objectif</span>
                <span className={`text-xs font-medium ${
                  metrics.gapAmount > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {metrics.gapAmount > 0 ? 
                    `-${formatCurrency(metrics.gapAmount)}` : 
                    'Objectif dépassé'
                  }
                </span>
              </div>
              
              {metrics.gapAmount > 0 && (
                <div className="bg-red-50 p-2 rounded text-xs">
                  <div className="flex items-center gap-1 text-red-700">
                    <AlertTriangle className="h-3 w-3" />
                    Action requise: {formatCurrency(metrics.gapAmount)} à rattraper
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500">
              {metrics.daysRemaining} jours restants
            </div>
          </CardContent>
        </Card>

        {/* Performance Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              {metrics.variationPercentage >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              vs. Période précédente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${
                metrics.variationPercentage >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrics.variationPercentage >= 0 ? '+' : ''}{metrics.variationPercentage}%
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {metrics.variationPercentage >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600" />
              )}
              <span className={
                metrics.variationPercentage >= 0 ? 'text-green-600' : 'text-red-600'
              }>
                {formatCurrency(Math.abs(metrics.variationAbsolute))}
              </span>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>Période actuelle: {formatCurrency(objective.actual)}</div>
              <div>Période précédente: {formatCurrency(objective.previousPeriodActual)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Activité commerciale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{objective.salesCount}</div>
                <div className="text-xs text-gray-500">Ventes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{objective.appointmentsCount}</div>
                <div className="text-xs text-gray-500">RDV</div>
              </div>
            </div>

            {objective.margin && (
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Marge</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(objective.margin)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {Math.round((objective.margin / objective.actual) * 100)}% du CA
                </div>
              </div>
            )}

            <div className="space-y-1 text-xs text-gray-500">
              <div>Moyenne/jour: {formatCurrency(Math.round(metrics.averageDailyActual))}</div>
              <div>Objectif/jour: {formatCurrency(Math.round(metrics.averageDailyTarget))}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {metrics.recommendedActions.length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Actions recommandées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.recommendedActions.map((action, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-sm text-blue-800">{action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
