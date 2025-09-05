
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CallResultModal, CallResult } from './call-result-modal';
import { ManagerSettingsModal } from './manager-settings-modal';
import { 
  Phone, 
  PhoneCall, 
  Clock, 
  MapPin, 
  Mail, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Euro,
  Target,
  Star,
  Zap,
  Timer,
  Users,
  BarChart3,
  Settings,
  PhoneIcon
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { 
  PriorityCallRecommendation, 
  generateMockPriorityCallsData,
  PriorityCallsAlgorithm,
  CallRecord,
  PersistentRecommendation,
  ManagerAlert,
  ManagerAlertSettings
} from '@/lib/priority-calls-algorithm';

interface PriorityCallsModuleProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function PriorityCallsModule({ isExpanded = false, onToggle }: PriorityCallsModuleProps) {
  // Simulate user session (in real app, this would come from authentication)
  const session = {
    user: {
      id: 'manager-1',
      role: 'MANAGER', // Change to 'SALES_REP' for regular user
      name: 'Pierre Martin'
    }
  };
  const [recommendations, setRecommendations] = useState<PriorityCallRecommendation[]>([]);
  const [completedCalls, setCompletedCalls] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [callResultModalOpen, setCallResultModalOpen] = useState(false);
  const [selectedCallRecommendation, setSelectedCallRecommendation] = useState<PriorityCallRecommendation | null>(null);
  const [managerSettingsOpen, setManagerSettingsOpen] = useState(false);
  const [dailyCallsSettings, setDailyCallsSettings] = useState({ dailyCallsTarget: 20 });
  
  // New state for improved algorithm
  const [managerAlerts, setManagerAlerts] = useState<ManagerAlert[]>([]);
  const [persistentClients, setPersistentClients] = useState<PersistentRecommendation[]>([]);
  const [managerAlertSettings, setManagerAlertSettings] = useState<ManagerAlertSettings>({
    enableAlerts: true,
    alertAfterDays: 2,
    alertFrequency: 'DAILY',
    emailNotifications: false,
    managerEmail: 'manager@company.ch'
  });
  const [showManagerAlerts, setShowManagerAlerts] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('priority-calls-settings');
    if (savedSettings) {
      setDailyCallsSettings(JSON.parse(savedSettings));
    }

    const savedManagerSettings = localStorage.getItem('manager-alert-settings');
    if (savedManagerSettings) {
      setManagerAlertSettings(JSON.parse(savedManagerSettings));
    }
  }, []);

  useEffect(() => {
    // Load data using improved algorithm
    const loadEnhancedRecommendations = async () => {
      setLoading(true);
      
      try {
        // Load persistent recommendations and recent calls from "database"
        const persistentRecs = await PriorityCallsAlgorithm.getPersistentRecommendations();
        const recentCalls = await PriorityCallsAlgorithm.getRecentCalls(30);
        
        // For demo, we'll simulate the criteria (in real app, this would come from API)
        const mockCriteria = {
          topCustomers: [],
          currentYearPurchases: [],
          upcomingRoutes: [],
          allCustomers: [],
          recentCalls,
          persistentRecommendations: persistentRecs
        };

        // Use enhanced algorithm or fallback to mock data for demo
        if (persistentRecs.length > 0 || recentCalls.length > 0) {
          const result = PriorityCallsAlgorithm.generateDailyRecommendations(
            mockCriteria,
            dailyCallsSettings.dailyCallsTarget,
            managerAlertSettings
          );
          
          setRecommendations(result.recommendations);
          setManagerAlerts(result.managerAlerts);
          setPersistentClients(result.persistentClients);
          
          // Save updated persistent clients
          await PriorityCallsAlgorithm.savePersistentRecommendations(result.persistentClients);
        } else {
          // Fallback to mock data for demo
          const mockRecs = generateMockPriorityCallsData(dailyCallsSettings.dailyCallsTarget);
          setRecommendations(mockRecs);
          
          // Convert to persistent recommendations for tracking
          const newPersistent = mockRecs.map(rec => ({
            customerId: rec.customerId,
            customerName: rec.customerName,
            firstRecommendedDate: new Date(),
            daysPersisted: 0,
            urgencyLevel: rec.urgencyLevel,
            attemptCount: 0,
            managerNotified: false,
            priority: rec.priority
          }));
          
          setPersistentClients(newPersistent);
          await PriorityCallsAlgorithm.savePersistentRecommendations(newPersistent);
        }
      } catch (error) {
        console.error('Error loading enhanced recommendations:', error);
        // Fallback to basic mock data
        setRecommendations(generateMockPriorityCallsData(dailyCallsSettings.dailyCallsTarget));
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadEnhancedRecommendations, 1000);
    return () => clearTimeout(timer);
  }, [dailyCallsSettings, managerAlertSettings]);

  const handleCallClient = (recommendation: PriorityCallRecommendation) => {
    if (recommendation.phone) {
      // Open phone app
      window.location.href = `tel:${recommendation.phone}`;
      // Then open result modal to capture call outcome
      setTimeout(() => {
        setSelectedCallRecommendation(recommendation);
        setCallResultModalOpen(true);
      }, 1000); // Give time for phone app to open
    }
  };

  const handleEmailClient = (email: string) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const handleCallResult = async (result: CallResult, notes: string) => {
    if (selectedCallRecommendation) {
      // Create enhanced call record
      const callRecord: CallRecord = {
        id: `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customerId: selectedCallRecommendation.customerId,
        callDate: new Date(),
        result: result as CallRecord['result'],
        notes,
        followUpRequired: result === 'CONNECTED_CALLBACK_LATER',
        nextContactDate: result === 'CONNECTED_CALLBACK_LATER' ? 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined // 1 week later
      };
      
      try {
        // Save to enhanced database system
        await PriorityCallsAlgorithm.recordCall(callRecord);
        
        // Update persistent clients - remove successfully contacted client
        const updatedPersistent = persistentClients.filter(
          p => p.customerId !== selectedCallRecommendation.customerId
        );
        setPersistentClients(updatedPersistent);
        await PriorityCallsAlgorithm.savePersistentRecommendations(updatedPersistent);

        // Remove this call from recommendations (completed)
        setRecommendations(prev => 
          prev.filter(rec => rec.id !== selectedCallRecommendation.id)
        );
        
        // Add to completed calls for UI
        setCompletedCalls(prev => new Set([...prev, selectedCallRecommendation.id]));
        
        console.log('Enhanced call result saved:', callRecord);
        
        // Show success message (you can implement a toast system)
        console.log(`✅ Appel enregistré avec succès pour ${selectedCallRecommendation.customerName}`);
        
      } catch (error) {
        console.error('Error saving call result:', error);
        // Fallback to old method
        const existingCalls = JSON.parse(localStorage.getItem('customer-calls') || '[]');
        existingCalls.push(callRecord);
        localStorage.setItem('customer-calls', JSON.stringify(existingCalls));
      }
    }
    
    setCallResultModalOpen(false);
    setSelectedCallRecommendation(null);
  };

  const handleManagerSettings = (newSettings: { 
    dailyCallsTarget: number;
    managerAlertSettings: ManagerAlertSettings;
  }) => {
    setDailyCallsSettings({ dailyCallsTarget: newSettings.dailyCallsTarget });
    setManagerAlertSettings(newSettings.managerAlertSettings);
    
    localStorage.setItem('priority-calls-settings', JSON.stringify({ dailyCallsTarget: newSettings.dailyCallsTarget }));
    localStorage.setItem('manager-alert-settings', JSON.stringify(newSettings.managerAlertSettings));
    
    setManagerSettingsOpen(false);
  };

  const isManager = session?.user?.role === 'MANAGER';

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL': return <AlertTriangle className="h-4 w-4" />;
      case 'HIGH': return <Zap className="h-4 w-4" />;
      case 'MEDIUM': return <Timer className="h-4 w-4" />;
      case 'LOW': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Calculate completion rate based on initial target vs remaining calls
  const initialTarget = dailyCallsSettings.dailyCallsTarget;
  const remainingCalls = recommendations.length;
  const completedToday = Math.max(0, initialTarget - remainingCalls);
  const completionRate = initialTarget > 0 
    ? Math.round((completedToday / initialTarget) * 100) 
    : 0;
  
  // Determine if module should pulse (have pending calls)
  const hasOngoingCalls = remainingCalls > 0;
  const allCallsCompleted = remainingCalls === 0;

  const urgencyStats = recommendations.reduce((acc, rec) => {
    acc[rec.urgencyLevel] = (acc[rec.urgencyLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-red-800">
            <div className="p-2 bg-red-100 rounded-full">
              <Phone className="h-5 w-5 text-red-600" />
            </div>
            J'attendais votre appel
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Chargement...
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isExpanded) {
    return (
      <Card 
        className={`border-2 cursor-pointer hover:shadow-md transition-all ${
          hasOngoingCalls 
            ? "border-red-400 bg-gradient-to-r from-red-100 to-orange-100 animate-pulse-red" 
            : "border-green-400 bg-gradient-to-r from-green-50 to-blue-50"
        }`} 
        onClick={onToggle}
      >
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center justify-between ${
            hasOngoingCalls ? "text-red-800" : "text-green-800"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                hasOngoingCalls ? "bg-red-100" : "bg-green-100"
              }`}>
                <Phone className={`h-5 w-5 ${
                  hasOngoingCalls ? "text-red-600" : "text-green-600"
                }`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  J'attendais votre appel
                  <Badge variant="secondary" className={
                    hasOngoingCalls 
                      ? "bg-red-100 text-red-800" 
                      : "bg-green-100 text-green-800"
                  }>
                    {allCallsCompleted ? "Terminé!" : "En cours"}
                  </Badge>
                </div>
                <p className={`text-sm font-normal mt-1 ${
                  hasOngoingCalls ? "text-red-600" : "text-green-600"
                }`}>
                  {allCallsCompleted 
                    ? `Tous les appels quotidiens réalisés (${completedToday}/${initialTarget})`
                    : `${remainingCalls} appels restants aujourd'hui`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={completionRate} className="w-16" />
              <span className="text-sm font-medium">{completionRate}%</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-4 gap-2">
            {recommendations.slice(0, 4).map((rec, index) => (
              <div key={rec.id} className="text-center">
                <Avatar className="h-8 w-8 mx-auto mb-1">
                  <AvatarFallback className={`text-white text-xs ${getUrgencyColor(rec.urgencyLevel)}`}>
                    {rec.customerName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-red-700 font-medium truncate">
                  {rec.customerName.split(' ')[0]}
                </p>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4 border-red-200 text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
          >
            Voir tous les appels recommandés
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${
      hasOngoingCalls 
        ? "border-red-400 bg-gradient-to-r from-red-100 to-orange-100" 
        : "border-green-400 bg-gradient-to-r from-green-50 to-blue-50"
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-3 ${
            hasOngoingCalls ? "text-red-800" : "text-green-800"
          }`}>
            <div className={`p-2 rounded-full ${
              hasOngoingCalls ? "bg-red-100" : "bg-green-100"
            }`}>
              <Phone className={`h-6 w-6 ${
                hasOngoingCalls ? "text-red-600" : "text-green-600"
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                J'attendais votre appel
                <Badge variant="secondary" className={
                  hasOngoingCalls 
                    ? "bg-red-100 text-red-800" 
                    : "bg-green-100 text-green-800"
                }>
                  {allCallsCompleted ? "Terminé!" : "En cours"}
                </Badge>
                {isManager && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setManagerSettingsOpen(true)}
                    className="p-1 h-6 w-6"
                    title="Configuration Manager"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className={`text-sm font-normal mt-1 ${
                hasOngoingCalls ? "text-red-600" : "text-green-600"
              }`}>
                {allCallsCompleted 
                  ? `Félicitations! Tous les ${completedToday} appels quotidiens réalisés`
                  : `${remainingCalls} appels recommandés par l'algorithme de priorisation`
                }
              </p>
            </div>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggle}
            className={`${
              hasOngoingCalls 
                ? "border-red-200 text-red-700 hover:bg-red-50" 
                : "border-green-200 text-green-700 hover:bg-green-50"
            }`}
          >
            Réduire
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="calls" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4" />
              Appels ({recommendations.length})
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Progression
            </TabsTrigger>
            {isManager && (
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alertes ({managerAlerts.length})
                {managerAlerts.length > 0 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="calls">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <Card 
                    key={rec.id} 
                    className={`transition-all ${
                      completedCalls.has(rec.id) 
                        ? 'bg-green-50 border-green-200 opacity-75' 
                        : 'bg-white border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className={`text-white ${getUrgencyColor(rec.urgencyLevel)}`}>
                                {rec.customerName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{rec.customerName}</h3>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="secondary" 
                                  className={`${getUrgencyColor(rec.urgencyLevel)} text-white`}
                                >
                                  {getUrgencyIcon(rec.urgencyLevel)}
                                  {rec.urgencyLevel}
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50">
                                  Score: {rec.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <p className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              {rec.reason}
                            </p>
                            
                            {rec.location && (
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                {rec.location}
                              </p>
                            )}

                            <div className="flex items-center gap-4">
                              {rec.lastVisit && (
                                <span className="flex items-center gap-1 text-xs">
                                  <Calendar className="h-3 w-3" />
                                  Dernière visite: {formatDate(rec.lastVisit)}
                                </span>
                              )}
                              {rec.lastCall && (
                                <span className="flex items-center gap-1 text-xs">
                                  <Phone className="h-3 w-3" />
                                  Dernier appel: {formatDate(rec.lastCall)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Euro className="h-4 w-4 text-green-500" />
                              <span className="font-medium text-green-600">
                                Potentiel: {formatCurrency(rec.estimatedValue)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {rec.segment}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-2">
                              {rec.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs bg-gray-100">
                                  {tag.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {completedCalls.has(rec.id) ? (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Appelé
                            </Badge>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleCallClient(rec)}
                                disabled={!rec.phone}
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Appeler
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEmailClient(rec.email || '')}
                                disabled={!rec.email}
                              >
                                <Mail className="h-4 w-4 mr-1" />
                                Email
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Critique</p>
                      <p className="text-2xl font-bold text-red-600">{urgencyStats.CRITICAL || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Élevé</p>
                      <p className="text-2xl font-bold text-orange-600">{urgencyStats.HIGH || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Moyen</p>
                      <p className="text-2xl font-bold text-yellow-600">{urgencyStats.MEDIUM || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Faible</p>
                      <p className="text-2xl font-bold text-blue-600">{urgencyStats.LOW || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Valeur Potentielle Totale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(recommendations.reduce((sum, rec) => sum + rec.estimatedValue, 0))}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Potentiel de vente total des 20 appels recommandés
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-5 w-5 text-blue-600" />
                    Répartition par Segment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(
                      recommendations.reduce((acc, rec) => {
                        acc[rec.segment] = (acc[rec.segment] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([segment, count]) => (
                      <div key={segment} className="flex items-center justify-between">
                        <span className="text-sm">{segment}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Progression Quotidienne
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Appels réalisés</span>
                        <span className="text-sm text-gray-600">
                          {completedCalls.size}/{recommendations.length}
                        </span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{completionRate}% complété</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{completedCalls.size}</p>
                        <p className="text-sm text-gray-600">Appels effectués</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{recommendations.length - completedCalls.size}</p>
                        <p className="text-sm text-gray-600">Restants</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Objectifs du Module
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Dynamiser la totalité de la cartera de clients</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Assurer un contact régulier avec tous les clients</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Favoriser plus de rdv de qualité</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Augmenter le volume de ventes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {isManager && (
            <TabsContent value="alerts">
              <ScrollArea className="h-96">
                {managerAlerts.length === 0 ? (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-6 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-green-800 mb-2">Aucune alerte</h3>
                      <p className="text-sm text-green-600">
                        Tous les clients prioritaires sont bien suivis. Excellent travail!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {managerAlerts.map((alert) => (
                      <Card 
                        key={alert.id} 
                        className={`border-2 ${
                          alert.type === 'CRITICAL_MISSED' 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-orange-300 bg-orange-50'
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className={`h-5 w-5 ${
                                  alert.type === 'CRITICAL_MISSED' 
                                    ? 'text-red-600' 
                                    : 'text-orange-600'
                                }`} />
                                <h4 className="font-semibold text-gray-900">
                                  {alert.customerName}
                                </h4>
                                <Badge 
                                  variant="secondary" 
                                  className={`${
                                    alert.urgencyLevel === 'CRITICAL' 
                                      ? 'bg-red-500 text-white' 
                                      : 'bg-orange-500 text-white'
                                  }`}
                                >
                                  {alert.urgencyLevel}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-gray-700 mb-2">
                                {alert.message}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDateTime(alert.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Euro className="h-3 w-3" />
                                  Valeur: {formatCurrency(alert.estimatedValue)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => {
                                  // Mark alert as acknowledged
                                  setManagerAlerts(prev => 
                                    prev.map(a => 
                                      a.id === alert.id 
                                        ? { ...a, acknowledged: true }
                                        : a
                                    )
                                  );
                                }}
                                disabled={alert.acknowledged}
                              >
                                {alert.acknowledged ? 'Vu' : 'Marquer comme vu'}
                              </Button>
                              
                              {alert.type === 'CRITICAL_MISSED' && (
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white text-xs"
                                  onClick={() => {
                                    // Find and prioritize this client
                                    const clientRec = recommendations.find(r => r.customerId === alert.customerId);
                                    if (clientRec) {
                                      setSelectedCallRecommendation(clientRec);
                                      setCallResultModalOpen(true);
                                    }
                                  }}
                                >
                                  Appeler maintenant
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              {/* Alert Settings for Manager */}
              <Card className="mt-4 bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-800 text-base">
                    <Settings className="h-4 w-4" />
                    Configuration des Alertes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-medium text-blue-700">Alerter après:</label>
                      <p className="text-blue-600">{managerAlertSettings.alertAfterDays} jours</p>
                    </div>
                    <div>
                      <label className="font-medium text-blue-700">Fréquence:</label>
                      <p className="text-blue-600">{managerAlertSettings.alertFrequency}</p>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                    onClick={() => {
                      // Open manager settings modal with alert configuration
                      setManagerSettingsOpen(true);
                    }}
                  >
                    Modifier la configuration
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>

      {/* Call Result Modal */}
      {selectedCallRecommendation && (
        <CallResultModal
          isOpen={callResultModalOpen}
          onClose={() => {
            setCallResultModalOpen(false);
            setSelectedCallRecommendation(null);
          }}
          onSaveResult={handleCallResult}
          customerName={selectedCallRecommendation.customerName}
          customerPhone={selectedCallRecommendation.phone}
        />
      )}

      {/* Manager Settings Modal */}
      <ManagerSettingsModal
        isOpen={managerSettingsOpen}
        onClose={() => setManagerSettingsOpen(false)}
        onSave={handleManagerSettings}
        currentSettings={{
          dailyCallsTarget: dailyCallsSettings.dailyCallsTarget,
          managerAlertSettings: managerAlertSettings
        }}
      />
    </Card>
  );
}
