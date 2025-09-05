
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import {
  Trophy,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
  Download
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface SalesData {
  actualSales: number;
  targetSales: number;
  progression: number;
  variance: number;
}

interface SalesRepPerformance {
  id: string;
  name: string;
  actualSales: number;
  targetSales: number;
  deals: number;
  conversionRate: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

interface SalesFunnelData {
  stage: string;
  count: number;
  value: number;
  percentage: number;
  fill: string;
}

interface PredictionData {
  period: string;
  predicted: number;
  target: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
  }[];
}

const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

export default function SalesManagerDashboard() {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [salesReps, setSalesReps] = useState<SalesRepPerformance[]>([]);
  const [funnelData, setFunnelData] = useState<SalesFunnelData[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [salesRes, repsRes, funnelRes, predictionRes] = await Promise.all([
        fetch(`/api/sales-manager/overview?period=${selectedPeriod}`),
        fetch(`/api/sales-manager/ranking?period=${selectedPeriod}`),
        fetch(`/api/sales-manager/funnel?period=${selectedPeriod}`),
        fetch(`/api/sales-manager/predictions?period=${selectedPeriod}`)
      ]);

      if (salesRes.ok) {
        const salesData = await salesRes.json();
        setSalesData(salesData);
      }

      if (repsRes.ok) {
        const repsData = await repsRes.json();
        setSalesReps(repsData.salesReps);
      }

      if (funnelRes.ok) {
        const funnelData = await funnelRes.json();
        setFunnelData(funnelData.funnel);
      }

      if (predictionRes.ok) {
        const predictionData = await predictionRes.json();
        setPredictionData(predictionData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Sales Manager</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble des performances commerciales</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPIs Overview */}
      {salesData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-brand-blue to-brand-navy text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventes Actuelles</CardTitle>
              <DollarSign className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(salesData.actualSales)}</div>
              <p className="text-xs text-white/70">
                {salesData.variance >= 0 ? '+' : ''}{formatPercentage(salesData.variance)} vs objectif
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-brand-sky to-brand-blue text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectif</CardTitle>
              <Target className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(salesData.targetSales)}</div>
              <div className="mt-2">
                <Progress 
                  value={salesData.progression} 
                  className="h-2 bg-white/20" 
                />
                <p className="text-xs text-white/70 mt-1">
                  {formatPercentage(salesData.progression)} atteint
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-brand-green to-brand-sky text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Équipe Active</CardTitle>
              <Users className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesReps.length}</div>
              <p className="text-xs text-white/70">Commerciaux</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-brand-orange to-brand-green text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Période</CardTitle>
              <Calendar className="h-4 w-4 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedPeriod === 'month' ? 'Mois' : 
                 selectedPeriod === 'quarter' ? 'Trimestre' : 'Année'}
              </div>
              <p className="text-xs text-white/70">Période sélectionnée</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="funnel">Entonnoir</TabsTrigger>
          <TabsTrigger value="ranking">Classement</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique des ventes vs objectifs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-brand-blue" />
                  Performance vs Objectifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesReps.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        formatCurrency(value), 
                        name === 'actualSales' ? 'Ventes' : 'Objectif'
                      ]}
                    />
                    <Bar dataKey="actualSales" fill="#3b82f6" name="Ventes" />
                    <Bar dataKey="targetSales" fill="#93c5fd" name="Objectif" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Répartition des performances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2 text-brand-blue" />
                  Répartition des Ventes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesReps.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="actualSales"
                    >
                      {salesReps.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Entonnoir de ventes */}
        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-brand-blue" />
                Entonnoir de Ventes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelData.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{stage.stage}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{stage.count} deals</span>
                        <span className="text-sm font-semibold">{formatCurrency(stage.value)}</span>
                        <Badge variant="outline">{formatPercentage(stage.percentage)}</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${stage.percentage}%`,
                          backgroundColor: stage.fill
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classement des vendeurs */}
        <TabsContent value="ranking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-brand-blue" />
                Classement des Commerciaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesReps.map((rep, index) => (
                  <div key={rep.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue text-white font-bold text-sm">
                        {rep.rank}
                      </div>
                      <div>
                        <h3 className="font-medium">{rep.name}</h3>
                        <p className="text-sm text-gray-600">{rep.deals} deals</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(rep.actualSales)}</div>
                        <div className="text-sm text-gray-600">
                          {formatPercentage((rep.actualSales / rep.targetSales) * 100)} de l'objectif
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-1">
                          {formatPercentage(rep.conversionRate)}
                        </span>
                        {rep.trend === 'up' && <ArrowUp className="h-4 w-4 text-green-500" />}
                        {rep.trend === 'down' && <ArrowDown className="h-4 w-4 text-red-500" />}
                        {rep.trend === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                      </div>
                      
                      {index < 3 && (
                        <Award className={`h-5 w-5 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 'text-orange-500'
                        }`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prédictions */}
        <TabsContent value="predictions" className="space-y-6">
          {predictionData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-brand-blue" />
                    Prédiction de Fermeture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-blue mb-2">
                      {formatCurrency(predictionData.predicted)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Prédiction pour {predictionData.period}
                    </div>
                    <div className="mt-2">
                      <Badge 
                        variant={predictionData.confidence >= 80 ? "default" : "secondary"}
                        className="bg-brand-blue"
                      >
                        {formatPercentage(predictionData.confidence)} de confiance
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Comparaison avec l'objectif:</h4>
                    <div className="flex justify-between items-center">
                      <span>Objectif:</span>
                      <span className="font-semibold">{formatCurrency(predictionData.target)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Écart prévu:</span>
                      <span className={`font-semibold ${
                        predictionData.predicted >= predictionData.target 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {predictionData.predicted >= predictionData.target ? '+' : ''}
                        {formatCurrency(predictionData.predicted - predictionData.target)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Facteurs d'Influence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {predictionData.factors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{factor.name}</span>
                        <div className="flex items-center space-x-2">
                          <div 
                            className={`w-16 h-2 rounded-full ${
                              factor.impact > 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{
                              width: `${Math.abs(factor.impact) * 2}px`
                            }}
                          />
                          <span className={`text-sm font-medium ${
                            factor.impact > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {factor.impact > 0 ? '+' : ''}{formatPercentage(factor.impact)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
