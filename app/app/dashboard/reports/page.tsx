
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { ManagerObjectivesPanel } from '@/components/sales-objectives/manager-objectives-panel';
import { 
  TrendingUp, 
  Users, 
  Euro, 
  Target, 
  Calendar, 
  BarChart3, 
  PieChart,
  Activity
} from 'lucide-react';

const mockReportsData = {
  salesMetrics: {
    totalRevenue: 1250000,
    revenueGrowth: 15.3,
    dealsWon: 23,
    dealsLost: 12,
    winRate: 65.7,
    averageDealSize: 54348
  },
  customerMetrics: {
    totalCustomers: 147,
    activeCustomers: 132,
    newCustomers: 18,
    churnRate: 2.3,
    customerSatisfaction: 4.6
  },
  activityMetrics: {
    totalVisits: 89,
    callsCompleted: 156,
    offersCreated: 34,
    meetingsScheduled: 67
  },
  teamPerformance: [
    { name: 'Marie Dubois', revenue: 180000, deals: 8, winRate: 72 },
    { name: 'Jean Martin', revenue: 165000, deals: 6, winRate: 68 },
    { name: 'Sophie Leroy', revenue: 142000, deals: 7, winRate: 65 },
    { name: 'Pierre Blanc', revenue: 138000, deals: 5, winRate: 63 }
  ],
  monthlyTrend: [
    { month: 'Jan', revenue: 95000, deals: 3 },
    { month: 'Fév', revenue: 120000, deals: 4 },
    { month: 'Mar', revenue: 110000, deals: 3 },
    { month: 'Avr', revenue: 135000, deals: 5 },
    { month: 'Mai', revenue: 145000, deals: 4 },
    { month: 'Juin', revenue: 160000, deals: 6 }
  ]
};

export default function ReportsPage() {
  const [period, setPeriod] = useState('current-quarter');
  const { salesMetrics, customerMetrics, activityMetrics, teamPerformance, monthlyTrend } = mockReportsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-brand-sky/30">
        <div>
          <h1 className="text-4xl font-bold text-brand-navy bg-gradient-to-r from-brand-navy to-brand-blue bg-clip-text text-transparent">
            Rapports & Analytics
          </h1>
          <p className="text-brand-navy/70 mt-2 text-lg">Analyse des performances commerciales et gestion d'équipe</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48 h-12 border-brand-sky bg-white/80 backdrop-blur-sm shadow-md focus:ring-brand-blue focus:border-brand-blue">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-month">Mois en cours</SelectItem>
            <SelectItem value="current-quarter">Trimestre en cours</SelectItem>
            <SelectItem value="current-year">Année en cours</SelectItem>
            <SelectItem value="last-quarter">Trimestre précédent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Rapports de Vente
          </TabsTrigger>
          <TabsTrigger value="objectives" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Gestion des Objectifs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">

      {/* Sales Metrics */}
      <div>
        <h2 className="text-2xl font-bold text-brand-navy mb-6">Métriques de Vente</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hexagon-decoration">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(salesMetrics.totalRevenue)}
                  </div>
                  <div className="text-sm text-brand-navy/70 font-medium">Chiffre d'affaires</div>
                  <div className="flex items-center text-xs text-green-600 mt-2 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{salesMetrics.revenueGrowth}% vs période précédente
                  </div>
                </div>
                <Euro className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-brand-blue">{salesMetrics.winRate}%</div>
                  <div className="text-sm text-brand-navy/70 font-medium">Taux de succès</div>
                  <div className="text-xs text-brand-navy/60 mt-2 bg-brand-sky/20 px-2 py-1 rounded-full">
                    {salesMetrics.dealsWon} gagnées / {salesMetrics.dealsLost} perdues
                  </div>
                </div>
                <Target className="h-8 w-8 text-brand-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-brand-navy">
                    {formatCurrency(salesMetrics.averageDealSize)}
                  </div>
                  <div className="text-sm text-brand-navy/70 font-medium">Taille moyenne affaire</div>
                  <div className="text-xs text-brand-navy/60 mt-2 bg-brand-sky/20 px-2 py-1 rounded-full">
                    Basé sur {salesMetrics.dealsWon + salesMetrics.dealsLost} affaires
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-brand-navy" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Metrics */}
      <div>
        <h2 className="text-2xl font-bold text-brand-navy mb-6">Métriques Clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-navy">{customerMetrics.totalCustomers}</div>
                <div className="text-sm text-brand-navy/70 font-medium">Total clients</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{customerMetrics.activeCustomers}</div>
                <div className="text-sm text-brand-navy/70 font-medium">Clients actifs</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-light-blue">{customerMetrics.newCustomers}</div>
                <div className="text-sm text-brand-navy/70 font-medium">Nouveaux clients</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{customerMetrics.churnRate}%</div>
                <div className="text-sm text-brand-navy/70 font-medium">Taux de churn</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité Commerciale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{activityMetrics.totalVisits}</div>
                  <div className="text-sm text-gray-600">Visites réalisées</div>
                </div>
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{activityMetrics.callsCompleted}</div>
                  <div className="text-sm text-gray-600">Appels terminés</div>
                </div>
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{activityMetrics.offersCreated}</div>
                  <div className="text-sm text-gray-600">Offres créées</div>
                </div>
                <PieChart className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{activityMetrics.meetingsScheduled}</div>
                  <div className="text-sm text-gray-600">RDV programmés</div>
                </div>
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Performance */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance de l'Équipe</h2>
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Commercial</th>
                    <th className="text-right py-3 px-4 font-semibold">CA Réalisé</th>
                    <th className="text-right py-3 px-4 font-semibold">Affaires</th>
                    <th className="text-right py-3 px-4 font-semibold">Taux de Succès</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformance.map((member, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{member.name}</td>
                      <td className="text-right py-3 px-4 text-green-600 font-semibold">
                        {formatCurrency(member.revenue)}
                      </td>
                      <td className="text-right py-3 px-4">{member.deals}</td>
                      <td className="text-right py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.winRate >= 70 ? 'bg-green-100 text-green-800' :
                          member.winRate >= 65 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {member.winRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tendance Mensuelle</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {monthlyTrend.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold">{month.month}</div>
                  <div className="flex items-center space-x-6">
                    <div className="text-green-600 font-semibold">
                      {formatCurrency(month.revenue)}
                    </div>
                    <div className="text-blue-600">
                      {month.deals} affaires
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="objectives" className="space-y-6">
          <ManagerObjectivesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
