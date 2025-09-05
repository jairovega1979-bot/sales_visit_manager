
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Euro,
  ChevronDown,
  ChevronRight,
  Trophy,
  AlertTriangle,
  Star
} from 'lucide-react';
import { SalesObjective, SalesObjectiveCalculator, Period } from '@/lib/sales-objectives';
import { formatCurrency } from '@/lib/utils';

interface TeamOverviewProps {
  objectives: SalesObjective[];
  period: Period;
  className?: string;
}

interface TeamMember {
  name: string;
  objectives: SalesObjective[];
  totalActual: number;
  totalTarget: number;
  completionRate: number;
  status: 'success' | 'warning' | 'danger';
  rank: number;
}

export function TeamOverview({ objectives, period, className = '' }: TeamOverviewProps) {
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  
  // Group objectives by team
  const teamGroups = objectives.reduce((groups, objective) => {
    const team = objective.team || 'Équipe non définie';
    if (!groups[team]) {
      groups[team] = [];
    }
    groups[team].push(objective);
    return groups;
  }, {} as Record<string, SalesObjective[]>);

  // Calculate team totals
  const teamStats = Object.entries(teamGroups).map(([teamName, teamObjectives]) => {
    const totalActual = teamObjectives.reduce((sum, obj) => sum + obj.actual, 0);
    const totalTarget = teamObjectives.reduce((sum, obj) => sum + obj.target, 0);
    const completionRate = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
    const status = completionRate >= 100 ? 'success' : completionRate >= 85 ? 'warning' : 'danger';

    // Group by salesperson within team
    const salespersonGroups = teamObjectives.reduce((groups, objective) => {
      const person = objective.salesperson || 'Vendeur non défini';
      if (!groups[person]) {
        groups[person] = [];
      }
      groups[person].push(objective);
      return groups;
    }, {} as Record<string, SalesObjective[]>);

    const members: TeamMember[] = Object.entries(salespersonGroups).map(([name, personObjectives]) => {
      const memberActual = personObjectives.reduce((sum, obj) => sum + obj.actual, 0);
      const memberTarget = personObjectives.reduce((sum, obj) => sum + obj.target, 0);
      const memberCompletion = memberTarget > 0 ? (memberActual / memberTarget) * 100 : 0;
      const memberStatus: 'success' | 'warning' | 'danger' = memberCompletion >= 100 ? 'success' : memberCompletion >= 85 ? 'warning' : 'danger';

      return {
        name,
        objectives: personObjectives,
        totalActual: memberActual,
        totalTarget: memberTarget,
        completionRate: memberCompletion,
        status: memberStatus,
        rank: 0 // Will be calculated after sorting
      };
    }).sort((a, b) => b.completionRate - a.completionRate)
      .map((member, index) => ({ ...member, rank: index + 1 }));

    return {
      teamName,
      totalActual,
      totalTarget,
      completionRate,
      status,
      members,
      objectives: teamObjectives
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  const toggleTeamExpansion = (teamName: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamName)) {
      newExpanded.delete(teamName);
    } else {
      newExpanded.add(teamName);
    }
    setExpandedTeams(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'danger': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 85) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2: return <Trophy className="h-4 w-4 text-gray-400" />;
      case 3: return <Trophy className="h-4 w-4 text-orange-400" />;
      default: return <Star className="h-4 w-4 text-gray-300" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Team Overview Cards */}
      {teamStats.map((team, teamIndex) => (
        <Card key={team.teamName} className={`border-l-4 ${getStatusColor(team.status)}`}>
          <CardHeader className="pb-3">
            <CardTitle 
              className="flex items-center justify-between cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => toggleTeamExpansion(team.teamName)}
            >
              <div className="flex items-center gap-3">
                {expandedTeams.has(team.teamName) ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <Users className="h-5 w-5" />
                <span>{team.teamName}</span>
                <Badge className={getStatusColor(team.status)}>
                  {team.members.length} membre{team.members.length > 1 ? 's' : ''}
                </Badge>
                {teamIndex === 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Trophy className="h-3 w-3 mr-1" />
                    Équipe leader
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <div className="font-bold">{Math.round(team.completionRate)}%</div>
                  <div className="text-gray-500">objectif</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(team.totalActual)}</div>
                  <div className="text-gray-500">réalisé</div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Team Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression équipe</span>
                <span>{formatCurrency(team.totalActual)} / {formatCurrency(team.totalTarget)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(team.completionRate)}`}
                  style={{ width: `${Math.min(team.completionRate, 100)}%` }}
                />
              </div>
            </div>

            {/* Team Members Details (Expanded) */}
            {expandedTeams.has(team.teamName) && (
              <div className="mt-4 space-y-3 border-t pt-4">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Détail des membres de l'équipe
                </h4>
                
                <div className="grid gap-3">
                  {team.members.map((member, memberIndex) => {
                    const metrics = member.objectives.map(obj => SalesObjectiveCalculator.calculateMetrics(obj))[0];
                    
                    return (
                      <Card key={member.name} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {getRankIcon(member.rank)}
                                <span className="text-xs text-gray-500">#{member.rank}</span>
                              </div>
                              
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`/avatars/${member.name.toLowerCase().replace(/\s+/g, '-')}.jpg`} />
                                <AvatarFallback className="text-xs">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-xs text-gray-500">
                                  {member.objectives[0]?.region} • {member.objectives[0]?.productLine}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="text-sm font-medium">{Math.round(member.completionRate)}%</div>
                                <div className="text-xs text-gray-500">objectif</div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-sm font-medium">{formatCurrency(member.totalActual)}</div>
                                <div className="text-xs text-gray-500">réalisé</div>
                              </div>

                              <div className="w-24">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${getProgressColor(member.completionRate)}`}
                                    style={{ width: `${Math.min(member.completionRate, 100)}%` }}
                                  />
                                </div>
                              </div>

                              <Badge className={getStatusColor(member.status)}>
                                {member.status === 'success' ? 'Objectif atteint' : 
                                 member.status === 'warning' ? 'En cours' : 
                                 'Action requise'}
                              </Badge>
                            </div>
                          </div>

                          {/* Member Performance Indicators */}
                          <div className="mt-3 grid grid-cols-4 gap-4 text-xs">
                            <div className="text-center">
                              <div className="font-medium">{member.objectives[0]?.salesCount || 0}</div>
                              <div className="text-gray-500">Ventes</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{member.objectives[0]?.appointmentsCount || 0}</div>
                              <div className="text-gray-500">RDV</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">
                                {member.objectives[0]?.margin ? formatCurrency(member.objectives[0].margin) : 'N/A'}
                              </div>
                              <div className="text-gray-500">Marge</div>
                            </div>
                            <div className="text-center">
                              <div className={`font-medium flex items-center justify-center gap-1 ${
                                metrics?.variationPercentage && metrics.variationPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {metrics?.variationPercentage && metrics.variationPercentage >= 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {metrics?.variationPercentage ? `${metrics.variationPercentage}%` : 'N/A'}
                              </div>
                              <div className="text-gray-500">vs Préc.</div>
                            </div>
                          </div>

                          {/* Recommendations for low performers */}
                          {member.status === 'danger' && metrics?.recommendedActions && (
                            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
                              <div className="flex items-center gap-1 text-red-700 font-medium mb-1">
                                <AlertTriangle className="h-3 w-3" />
                                Actions recommandées:
                              </div>
                              <div className="text-red-600">
                                {metrics.recommendedActions[0]}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Overall Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-900">Résumé général</div>
                <div className="text-sm text-blue-700">Performance globale de toutes les équipes</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-lg font-bold text-blue-900">
                  {teamStats.length}
                </div>
                <div className="text-xs text-blue-600">Équipes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-900">
                  {teamStats.reduce((sum, team) => sum + team.members.length, 0)}
                </div>
                <div className="text-xs text-blue-600">Vendeurs</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-900">
                  {Math.round(teamStats.reduce((sum, team, index) => sum + team.completionRate, 0) / teamStats.length)}%
                </div>
                <div className="text-xs text-blue-600">Moyenne</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
