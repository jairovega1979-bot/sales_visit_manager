
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  Edit3,
  X,
  Lightbulb,
  Target,
  Users,
  BarChart3,
  Calendar,
  ArrowLeft,
  Sparkles,
  Brain
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  category: 'TEAM_MANAGEMENT' | 'PERFORMANCE' | 'STRATEGY' | 'REPORTS' | 'MEETINGS' | 'OTHER';
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  isAISuggestion?: boolean;
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'TEAM_MANAGEMENT' | 'PERFORMANCE' | 'STRATEGY' | 'REPORTS' | 'MEETINGS' | 'OTHER';
  reasoning: string;
  createdAt: Date;
}

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800 border-blue-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  CRITICAL: 'bg-red-100 text-red-800 border-red-200'
};

const categoryIcons = {
  TEAM_MANAGEMENT: Users,
  PERFORMANCE: BarChart3,
  STRATEGY: Target,
  REPORTS: BarChart3,
  MEETINGS: Calendar,
  OTHER: Clock
};

const categoryLabels = {
  TEAM_MANAGEMENT: 'Gestion d\'équipe',
  PERFORMANCE: 'Performance',
  STRATEGY: 'Stratégie',
  REPORTS: 'Rapports',
  MEETINGS: 'Réunions',
  OTHER: 'Autre'
};

// Mock AI suggestions generator
const generateAISuggestions = (): AISuggestion[] => {
  const suggestions: AISuggestion[] = [
    {
      id: `ai-${Date.now()}-1`,
      title: 'Analyse des performances trimestrielles',
      description: 'Effectuer une revue approfondie des KPIs de l\'équipe commerciale pour Q3',
      priority: 'HIGH',
      category: 'PERFORMANCE',
      reasoning: 'Les données montrent une baisse de 8% des ventes ce trimestre. Une analyse détaillée permettrait d\'identifier les causes et d\'ajuster la stratégie.',
      createdAt: new Date()
    },
    {
      id: `ai-${Date.now()}-2`,
      title: 'Formation sur nouvelles techniques de vente',
      description: 'Organiser une session de formation pour l\'équipe sur les techniques de vente consultative',
      priority: 'MEDIUM',
      category: 'TEAM_MANAGEMENT',
      reasoning: 'Plusieurs membres de l\'équipe ont des taux de conversion en baisse. Une formation ciblée pourrait améliorer leurs performances.',
      createdAt: new Date()
    },
    {
      id: `ai-${Date.now()}-3`,
      title: 'Révision des objectifs individuels',
      description: 'Revoir et ajuster les objectifs individuels de chaque commercial',
      priority: 'HIGH',
      category: 'STRATEGY',
      reasoning: 'Les objectifs actuels semblent inadéquats par rapport aux capacités réelles de l\'équipe. Un réajustement favoriserait la motivation.',
      createdAt: new Date()
    },
    {
      id: `ai-${Date.now()}-4`,
      title: 'Réunion de suivi client VIP',
      description: 'Planifier des réunions de suivi avec les 5 plus gros clients',
      priority: 'CRITICAL',
      category: 'MEETINGS',
      reasoning: 'Trois clients VIP n\'ont pas été contactés depuis plus de 45 jours. Un suivi proactif est crucial pour maintenir ces relations.',
      createdAt: new Date()
    },
    {
      id: `ai-${Date.now()}-5`,
      title: 'Optimisation du processus de prospection',
      description: 'Analyser et améliorer le processus de génération de leads',
      priority: 'MEDIUM',
      category: 'STRATEGY',
      reasoning: 'Le pipeline de prospects est en baisse de 15%. Une optimisation du processus pourrait augmenter significativement les opportunités.',
      createdAt: new Date()
    }
  ];

  return suggestions;
};

export default function TachesPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as const,
    category: 'OTHER' as const,
    dueDate: ''
  });

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('manager-tasks');
    const savedSuggestions = localStorage.getItem('ai-suggestions');
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined
      }));
      setTasks(parsedTasks);
    }

    if (savedSuggestions) {
      const parsedSuggestions = JSON.parse(savedSuggestions).map((suggestion: any) => ({
        ...suggestion,
        createdAt: new Date(suggestion.createdAt)
      }));
      setAiSuggestions(parsedSuggestions);
    } else {
      // Generate initial AI suggestions
      const suggestions = generateAISuggestions();
      setAiSuggestions(suggestions);
      localStorage.setItem('ai-suggestions', JSON.stringify(suggestions));
    }

    setLoading(false);
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('manager-tasks', JSON.stringify(updatedTasks));
  };

  const saveAISuggestions = (updatedSuggestions: AISuggestion[]) => {
    setAiSuggestions(updatedSuggestions);
    localStorage.setItem('ai-suggestions', JSON.stringify(updatedSuggestions));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      status: 'PENDING',
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      createdAt: new Date(),
      isAISuggestion: false
    };

    saveTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'MEDIUM',
      category: 'OTHER',
      dueDate: ''
    });
    setShowAddModal(false);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: newStatus,
            completedAt: newStatus === 'COMPLETED' ? new Date() : undefined
          }
        : task
    );
    saveTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  const handleAcceptAISuggestion = (suggestion: AISuggestion) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: suggestion.title,
      description: suggestion.description,
      priority: suggestion.priority,
      category: suggestion.category,
      status: 'PENDING',
      createdAt: new Date(),
      isAISuggestion: true
    };

    saveTasks([...tasks, newTask]);
    
    // Remove suggestion from list
    const updatedSuggestions = aiSuggestions.filter(s => s.id !== suggestion.id);
    saveAISuggestions(updatedSuggestions);
  };

  const handleDismissAISuggestion = (suggestionId: string) => {
    const updatedSuggestions = aiSuggestions.filter(s => s.id !== suggestionId);
    saveAISuggestions(updatedSuggestions);
  };

  const handleDismissAllSuggestions = () => {
    setAiSuggestions([]);
    localStorage.removeItem('ai-suggestions');
  };

  const handleGenerateNewSuggestions = () => {
    const suggestions = generateAISuggestions();
    saveAISuggestions(suggestions);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return <AlertTriangle className="h-4 w-4" />;
      case 'HIGH': return <AlertTriangle className="h-4 w-4" />;
      case 'MEDIUM': return <Clock className="h-4 w-4" />;
      case 'LOW': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'IN_PROGRESS': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'PENDING': return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const pendingTasks = tasks.filter(task => task.status === 'PENDING');
  const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">Gestion des Tâches</h1>
            <p className="text-brand-navy/70 mt-1">
              Organisez vos tâches de management avec l'aide de l'IA
            </p>
          </div>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-brand-navy hover:bg-brand-blue">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Tâche
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Ajouter une Nouvelle Tâche</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Titre de la tâche"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Description détaillée"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priorité</Label>
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Faible</SelectItem>
                      <SelectItem value="MEDIUM">Moyenne</SelectItem>
                      <SelectItem value="HIGH">Élevée</SelectItem>
                      <SelectItem value="CRITICAL">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={newTask.category} onValueChange={(value: any) => setNewTask({...newTask, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEAM_MANAGEMENT">Gestion d'équipe</SelectItem>
                      <SelectItem value="PERFORMANCE">Performance</SelectItem>
                      <SelectItem value="STRATEGY">Stratégie</SelectItem>
                      <SelectItem value="REPORTS">Rapports</SelectItem>
                      <SelectItem value="MEETINGS">Réunions</SelectItem>
                      <SelectItem value="OTHER">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate">Date d'échéance</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddTask} disabled={!newTask.title.trim()}>
                  Ajouter la Tâche
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Brain className="h-5 w-5" />
                <Sparkles className="h-4 w-4" />
                Suggestions IA ({aiSuggestions.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleGenerateNewSuggestions}
                  className="text-purple-700 hover:text-purple-900"
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Nouvelles suggestions
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleDismissAllSuggestions}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4 mr-1" />
                  Ignorer tout
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {aiSuggestions.map((suggestion) => {
                const CategoryIcon = categoryIcons[suggestion.category];
                return (
                  <Card key={suggestion.id} className="bg-white border border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4 text-purple-600" />
                          <Badge className={priorityColors[suggestion.priority]}>
                            {getPriorityIcon(suggestion.priority)}
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {categoryLabels[suggestion.category]}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-blue-800 mb-1">Justification IA:</p>
                            <p className="text-xs text-blue-700">{suggestion.reasoning}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDismissAISuggestion(suggestion.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Ignorer
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAcceptAISuggestion(suggestion)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Accepter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingTasks.length}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">En Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">En Attente ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="in-progress">En Cours ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Terminées ({completedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {pendingTasks.map((task) => {
                const CategoryIcon = categoryIcons[task.category];
                return (
                  <Card key={task.id} className="bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CategoryIcon className="h-4 w-4 text-gray-500" />
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            {task.isAISuggestion && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Sparkles className="h-3 w-3 mr-1" />
                                IA
                              </Badge>
                            )}
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Badge className={priorityColors[task.priority]}>
                                {getPriorityIcon(task.priority)}
                                {task.priority}
                              </Badge>
                            </div>
                            <span>{categoryLabels[task.category]}</span>
                            {task.dueDate && (
                              <span>Échéance: {formatDate(task.dueDate)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateTaskStatus(task.id, 'IN_PROGRESS')}
                          >
                            Commencer
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateTaskStatus(task.id, 'COMPLETED')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Terminé
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {pendingTasks.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Aucune tâche en attente</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="in-progress">
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {inProgressTasks.map((task) => {
                const CategoryIcon = categoryIcons[task.category];
                return (
                  <Card key={task.id} className="bg-blue-50 border-blue-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CategoryIcon className="h-4 w-4 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            {task.isAISuggestion && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Sparkles className="h-3 w-3 mr-1" />
                                IA
                              </Badge>
                            )}
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Badge className={priorityColors[task.priority]}>
                                {getPriorityIcon(task.priority)}
                                {task.priority}
                              </Badge>
                            </div>
                            <span>{categoryLabels[task.category]}</span>
                            {task.dueDate && (
                              <span>Échéance: {formatDate(task.dueDate)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateTaskStatus(task.id, 'PENDING')}
                          >
                            Suspendre
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateTaskStatus(task.id, 'COMPLETED')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Terminé
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {inProgressTasks.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Aucune tâche en cours</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="completed">
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {completedTasks.map((task) => {
                const CategoryIcon = categoryIcons[task.category];
                return (
                  <Card key={task.id} className="bg-green-50 border-green-200 opacity-75 hover:opacity-100 transition-opacity">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CategoryIcon className="h-4 w-4 text-green-600" />
                            <h3 className="font-semibold text-gray-900 line-through decoration-green-500">{task.title}</h3>
                            {task.isAISuggestion && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Sparkles className="h-3 w-3 mr-1" />
                                IA
                              </Badge>
                            )}
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Badge className={priorityColors[task.priority]}>
                                {getPriorityIcon(task.priority)}
                                {task.priority}
                              </Badge>
                            </div>
                            <span>{categoryLabels[task.category]}</span>
                            {task.completedAt && (
                              <span className="text-green-600 font-medium">
                                Terminé: {formatDate(task.completedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateTaskStatus(task.id, 'PENDING')}
                          >
                            Réactiver
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {completedTasks.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Aucune tâche terminée</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
