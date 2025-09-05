
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  TrendingUp,
  Users,
  Target,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { 
  Period, 
  SalesObjective, 
  generateMockSalesObjectives, 
  generateMockSalesTrends, 
  getMockFilterOptions,
  generateTeamObjectives
} from '@/lib/sales-objectives';
import { KPIMetrics } from './kpi-metrics';
import { FiltersPanel } from './filters-panel';
import { TeamOverview } from './team-overview';

interface SalesObjectivesModuleProps {
  userRole?: string;
  userName?: string;
  className?: string;
}

export function SalesObjectivesModule({ userRole = 'SALES_REP', userName = 'Pierre Martin', className = '' }: SalesObjectivesModuleProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [objectives, setObjectives] = useState<SalesObjective[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const isManager = userRole === 'MANAGER';
  const [filterOptions] = useState(getMockFilterOptions(isManager, userName));
  
  const [selectedFilters, setSelectedFilters] = useState({
    team: isManager ? 'Toutes les équipes' : '',
    salesperson: isManager ? 'Tous les vendeurs' : userName,
    region: 'Toutes les régions',
    productLine: 'Toutes les lignes',
    channel: 'Tous les canaux'
  });

  // Restrict access for managers - they should use reports module
  if (isManager) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Accès réservé aux vendeurs</h2>
            <p className="text-yellow-700 mb-4">
              En tant que manager, vous devez accéder aux objectifs et performances de l'équipe 
              depuis le module <strong>Rapports</strong>.
            </p>
            <p className="text-sm text-yellow-600 mb-6">
              Le module Rapports vous donne accès à tous les vendeurs, permet de fixer les objectifs 
              et d'analyser les performances globales de l'équipe.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard/reports">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Accéder aux Rapports
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">
                  Retour au tableau de bord
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Generate objectives only for the current salesperson
      const objectivesData = generateMockSalesObjectives(userName);
      const trendsData = generateMockSalesTrends(selectedPeriod);
      
      // Filter objectives by selected period
      const filteredObjectives = objectivesData.filter(obj => obj.period === selectedPeriod);
      
      setObjectives(filteredObjectives);
      setTrends(trendsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading objectives data:', error);
    }
    
    setIsLoading(false);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      team: isManager ? 'Toutes les équipes' : '',
      salesperson: isManager ? 'Tous les vendeurs' : userName,
      region: 'Toutes les régions',
      productLine: 'Toutes les lignes',
      channel: 'Tous les canaux'
    });
  };

  const handleExportPDF = async () => {
    // Simulate PDF export
    console.log('Exporting PDF...', { period: selectedPeriod, filters: selectedFilters });
    // In real implementation, this would generate and download a PDF
    alert(`Export PDF pour la période ${selectedPeriod} - Fonctionnalité en développement`);
  };

  const handleExportCSV = async () => {
    // Simulate CSV export
    console.log('Exporting CSV...', { period: selectedPeriod, filters: selectedFilters });
    // In real implementation, this would generate and download a CSV
    alert(`Export CSV pour la période ${selectedPeriod} - Fonctionnalité en développement`);
  };

  const getCurrentObjective = (): SalesObjective | null => {
    return objectives.find(obj => obj.period === selectedPeriod) || null;
  };

  const periodLabels = {
    week: 'Semaine',
    month: 'Mois',
    year: 'Année'
  };

  const currentObjective = getCurrentObjective();
  const completionRate = currentObjective ? 
    Math.round((currentObjective.actual / currentObjective.target) * 100) : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Target className="h-8 w-8 text-blue-600" />
            Ventes / Objectifs
          </h1>
          <p className="text-gray-600 mt-1">
            Suivi des performances commerciales vs objectifs fixés par la Direction
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            Mis à jour: {lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </Badge>
          
          {completionRate >= 100 && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Objectif atteint !
            </Badge>
          )}
          
          {completionRate < 85 && (
            <Badge className="bg-red-100 text-red-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Action requise
            </Badge>
          )}
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">Période d'analyse:</span>
            </div>
            
            <Tabs 
              value={selectedPeriod} 
              onValueChange={(value) => setSelectedPeriod(value as Period)}
              className="w-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week" className="flex items-center gap-2">
                  Semaine
                </TabsTrigger>
                <TabsTrigger value="month" className="flex items-center gap-2">
                  Mois
                </TabsTrigger>
                <TabsTrigger value="year" className="flex items-center gap-2">
                  Année
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            Visualisation des données pour: <strong>{periodLabels[selectedPeriod]}</strong>
            {currentObjective && (
              <span className="ml-2">
                ({currentObjective.startDate.toLocaleDateString('fr-FR')} - {currentObjective.endDate.toLocaleDateString('fr-FR')})
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      <FiltersPanel
        filters={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
        onRefresh={loadData}
        isLoading={isLoading}
        isManager={isManager}
      />

      {/* Main Content - Individual View Only */}
      <div className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Chargement des données...</span>
                </div>
              </CardContent>
            </Card>
          ) : currentObjective ? (
            <KPIMetrics
              objective={currentObjective}
              trends={trends}
              period={selectedPeriod}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune donnée disponible</h3>
                <p className="text-gray-600">
                  Aucun objectif n'a été défini pour cette période.
                  Contactez la Direction des Ventes.
                </p>
              </CardContent>
            </Card>
          )}
      </div>

      {/* Help & Documentation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Comment ça marche ?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <div><strong>CA (Chiffre d'affaires):</strong> Montant des ventes réalisées et confirmées</div>
          <div><strong>Objectif:</strong> Target fixé par la Direction des Ventes en début de période</div>
          <div><strong>Forecast:</strong> Prévision basée sur le pipeline et les tendances actuelles</div>
          <div><strong>Variación:</strong> Comparaison avec la même période de l'exercice précédent</div>
          <div><strong>Mise à jour:</strong> Données synchronisées quotidiennement à 08:00 depuis le CRM</div>
          <div><strong>Accès:</strong> Seule la Direction des Ventes peut modifier les objectifs</div>
        </CardContent>
      </Card>
    </div>
  );
}
