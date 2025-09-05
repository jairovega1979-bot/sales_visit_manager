
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Target, 
  Edit, 
  Users, 
  TrendingUp, 
  Plus,
  Save,
  Calendar,
  Euro,
  Settings,
  CheckCircle,
  AlertTriangle,
  Trophy
} from 'lucide-react';
import { 
  Period, 
  SalesObjective, 
  generateTeamObjectives,
  SalesObjectiveCalculator,
  generateMockSalesTrends,
  getMockFilterOptions
} from '@/lib/sales-objectives';
import { TeamOverview } from './team-overview';
import { formatCurrency } from '@/lib/utils';

interface ManagerObjectivesPanelProps {
  className?: string;
}

interface ObjectiveEditForm {
  id: string;
  salesperson: string;
  period: Period;
  target: number;
  isEditing: boolean;
}

export function ManagerObjectivesPanel({ className = '' }: ManagerObjectivesPanelProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [objectives, setObjectives] = useState<SalesObjective[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState<ObjectiveEditForm | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const salespeople = [
    'Pierre Martin',
    'Marie Dubois', 
    'Jean-Claude Weber',
    'Sarah Müller',
    'David Rossi'
  ];

  useEffect(() => {
    loadObjectives();
  }, [selectedPeriod]);

  const loadObjectives = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const objectivesData = generateTeamObjectives();
      const trendsData = generateMockSalesTrends(selectedPeriod);
      
      // Filter objectives by selected period
      const filteredObjectives = objectivesData.filter(obj => obj.period === selectedPeriod);
      
      setObjectives(filteredObjectives);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error loading objectives data:', error);
    }
    
    setIsLoading(false);
  };

  const handleEditObjective = (objective: SalesObjective) => {
    setEditForm({
      id: objective.id,
      salesperson: objective.salesperson || 'Pierre Martin',
      period: objective.period,
      target: objective.target,
      isEditing: true
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveObjective = () => {
    if (!editForm) return;

    // Update objectives with new target
    setObjectives(prevObjectives => 
      prevObjectives.map(obj => 
        obj.id === editForm.id 
          ? { ...obj, target: editForm.target }
          : obj
      )
    );

    setIsEditDialogOpen(false);
    setEditForm(null);
    
    // Show success message (in real app, this would be a toast notification)
    alert(`Objectif mis à jour pour ${editForm.salesperson}: ${formatCurrency(editForm.target)}`);
  };

  const handleCreateObjective = () => {
    setEditForm({
      id: `new-${Date.now()}`,
      salesperson: salespeople[0],
      period: selectedPeriod,
      target: selectedPeriod === 'week' ? 50000 : selectedPeriod === 'month' ? 200000 : 2400000,
      isEditing: false
    });
    setIsEditDialogOpen(true);
  };

  const getObjectivesByPeriod = () => {
    return objectives.filter(obj => obj.period === selectedPeriod);
  };

  const getCurrentObjectives = getObjectivesByPeriod();
  
  // Calculate summary statistics
  const summaryStats = getCurrentObjectives.reduce((acc, obj) => {
    const metrics = SalesObjectiveCalculator.calculateMetrics(obj);
    acc.totalTarget += obj.target;
    acc.totalActual += obj.actual;
    acc.totalForecast += obj.forecast;
    acc.avgCompletion += metrics.completionPercentage;
    
    if (metrics.status === 'success') acc.onTrack++;
    else if (metrics.status === 'warning') acc.needsAttention++;
    else acc.critical++;
    
    return acc;
  }, {
    totalTarget: 0,
    totalActual: 0,
    totalForecast: 0,
    avgCompletion: 0,
    onTrack: 0,
    needsAttention: 0,
    critical: 0
  });

  if (getCurrentObjectives.length > 0) {
    summaryStats.avgCompletion = Math.round(summaryStats.avgCompletion / getCurrentObjectives.length);
  }

  const periodLabels = {
    week: 'Semaine',
    month: 'Mois', 
    year: 'Année'
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Gestion des Objectifs d'Équipe
          </h2>
          <p className="text-gray-600 mt-1">
            Définir et suivre les objectifs de chaque vendeur
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleCreateObjective} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvel objectif
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">Période:</span>
            </div>
            
            <Tabs 
              value={selectedPeriod} 
              onValueChange={(value) => setSelectedPeriod(value as Period)}
              className="w-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week">Semaine</TabsTrigger>
                <TabsTrigger value="month">Mois</TabsTrigger>
                <TabsTrigger value="year">Année</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(summaryStats.totalTarget)}
                </div>
                <div className="text-sm text-blue-700">Objectif Total</div>
              </div>
              <Euro className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(summaryStats.totalActual)}
                </div>
                <div className="text-sm text-green-700">Réalisé Total</div>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {summaryStats.avgCompletion}%
                </div>
                <div className="text-sm text-purple-700">Moyenne Équipe</div>
              </div>
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="flex justify-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{summaryStats.onTrack}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>{summaryStats.needsAttention}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{summaryStats.critical}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600">Status Vendeurs</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Objectives Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Objectifs Individuels - {periodLabels[selectedPeriod]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement des objectifs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Vendeur</th>
                    <th className="text-right py-3 px-4 font-semibold">Objectif</th>
                    <th className="text-right py-3 px-4 font-semibold">Réalisé</th>
                    <th className="text-right py-3 px-4 font-semibold">%</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                    <th className="text-center py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentObjectives.map((objective) => {
                    const metrics = SalesObjectiveCalculator.calculateMetrics(objective);
                    
                    return (
                      <tr key={objective.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{objective.salesperson}</span>
                            <span className="text-xs text-gray-500">({objective.team})</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 font-semibold">
                          {formatCurrency(objective.target)}
                        </td>
                        <td className="text-right py-3 px-4 text-green-600 font-semibold">
                          {formatCurrency(objective.actual)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className="font-semibold">{metrics.completionPercentage}%</span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge className={
                            metrics.status === 'success' ? 'bg-green-100 text-green-800' :
                            metrics.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {metrics.status === 'success' ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Atteint</>
                            ) : metrics.status === 'warning' ? (
                              <><AlertTriangle className="h-3 w-3 mr-1" /> Attention</>
                            ) : (
                              <><AlertTriangle className="h-3 w-3 mr-1" /> Critique</>
                            )}
                          </Badge>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditObjective(objective)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Modifier
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Overview */}
      <TeamOverview
        objectives={getCurrentObjectives}
        period={selectedPeriod}
      />

      {/* Edit Objective Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editForm?.isEditing ? 'Modifier l\'objectif' : 'Nouvel objectif'}
            </DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="salesperson" className="text-right">
                  Vendeur
                </Label>
                <Select 
                  value={editForm.salesperson} 
                  onValueChange={(value) => setEditForm({...editForm, salesperson: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {salespeople.map((person) => (
                      <SelectItem key={person} value={person}>
                        {person}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="period" className="text-right">
                  Période
                </Label>
                <Select 
                  value={editForm.period} 
                  onValueChange={(value) => setEditForm({...editForm, period: value as Period})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Semaine</SelectItem>
                    <SelectItem value="month">Mois</SelectItem>
                    <SelectItem value="year">Année</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target" className="text-right">
                  Objectif (CHF)
                </Label>
                <Input
                  id="target"
                  type="number"
                  value={editForm.target}
                  onChange={(e) => setEditForm({...editForm, target: Number(e.target.value)})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveObjective}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
