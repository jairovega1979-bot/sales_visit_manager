
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDateTime } from '@/lib/utils';
import { Search, Plus, Phone, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { CallPlan, CallStatus, CallPriority } from '@/lib/types';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ErrorDisplay, LoadingSpinner, EmptyState } from '@/components/ui/error-display';

const mockCallPlans: CallPlan[] = [
  {
    id: '1',
    customerName: 'Nestlé Suisse SA',
    customerId: 'cust-1',
    priority: 'HIGH' as CallPriority,
    objective: 'Suivi proposition CRM Enterprise',
    status: 'PENDING' as CallStatus,
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    notes: 'Client intéressé, attendre confirmation budget',
    nextAction: 'Relancer pour budget'
  },
  {
    id: '2',
    customerName: 'UBS Genève',
    customerId: 'cust-2',
    priority: 'HIGH' as CallPriority,
    objective: 'Négociation contrat consulting',
    status: 'PENDING' as CallStatus,
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    notes: 'Rendez-vous confirmé avec directeur IT',
    nextAction: 'Préparer présentation technique'
  },
  {
    id: '3',
    customerName: 'Roche Pharmaceuticals',
    customerId: 'cust-3',
    priority: 'MEDIUM' as CallPriority,
    objective: 'Présentation nouvelles fonctionnalités',
    status: 'COMPLETED' as CallStatus,
    scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 45,
    notes: 'Appel réussi, planifier démo technique',
    result: 'Intérêt confirmé pour démo'
  },
  {
    id: '4',
    customerName: 'Swiss Re',
    customerId: 'cust-4',
    priority: 'LOW' as CallPriority,
    objective: 'Check-in trimestriel',
    status: 'PENDING' as CallStatus,
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notes: 'Relation de maintenance',
    nextAction: 'Vérifier satisfaction client'
  }
];

export default function CallsPage() {
  const [calls, setCalls] = useState<CallPlan[]>(mockCallPlans);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { isLoading, error, executeWithErrorHandling, setError } = useErrorHandler();

  // Safe filtering with error handling
  const filteredCalls = (() => {
    try {
      if (!Array.isArray(calls)) {
        console.warn('Calls data is not an array:', calls);
        return [];
      }
      
      return calls.filter(call => {
        if (!call || typeof call.customerName !== 'string') {
          console.warn('Invalid call data:', call);
          return false;
        }
        
        const nameMatch = call.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const objectiveMatch = (call.objective || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = nameMatch || objectiveMatch;
        const matchesStatus = statusFilter === 'all' || call.status === statusFilter.toUpperCase();
        return matchesSearch && matchesStatus;
      });
    } catch (err) {
      console.error('Error filtering calls:', err);
      setError('Erreur lors du filtrage des appels');
      return [];
    }
  })();

  // Enhanced action handlers
  const handleCallCustomer = async (call: CallPlan) => {
    await executeWithErrorHandling(
      async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Calling customer:', call.customerName);
        return 'Call initiated';
      },
      (result) => {
        console.log('Call success:', result);
        // Could update call status here
      },
      (error) => {
        console.error('Failed to initiate call:', error);
      }
    );
  };

  const handleCompleteCall = async (call: CallPlan) => {
    await executeWithErrorHandling(
      async () => {
        // Simulate completing call
        const updatedCall: CallPlan = {
          ...call,
          status: 'COMPLETED',
          completedDate: new Date(),
          duration: 30 + Math.floor(Math.random() * 30) // Random duration
        };
        
        setCalls(prevCalls => 
          prevCalls.map(c => c.id === call.id ? updatedCall : c)
        );
        
        return 'Call completed';
      },
      (result) => {
        console.log('Call completed:', result);
      },
      (error) => {
        console.error('Failed to complete call:', error);
      }
    );
  };

  const handleRefresh = async () => {
    await executeWithErrorHandling(
      async () => {
        // Simulate data refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCalls([...mockCallPlans]);
        return 'Data refreshed';
      },
      () => console.log('Data refreshed successfully'),
      (error) => console.error('Failed to refresh data:', error)
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-50 text-red-800 border border-red-200';
      case 'MEDIUM': return 'bg-brand-sky/50 text-brand-navy border border-brand-blue/30';
      case 'LOW': return 'bg-green-50 text-green-800 border border-green-200';
      default: return 'bg-brand-sky/30 text-brand-navy border border-brand-sky/50';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'Haute';
      case 'MEDIUM': return 'Moyenne';
      case 'LOW': return 'Basse';
      default: return priority;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4 text-brand-light-blue" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELLED': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-brand-navy/50" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'COMPLETED': return 'Terminé';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  };

  // Safe stats calculation
  const pendingCalls = calls.filter(call => call.status === 'PENDING').length;
  const completedCalls = calls.filter(call => call.status === 'COMPLETED').length;
  const highPriorityCalls = calls.filter(call => call.priority === 'HIGH' && call.status === 'PENDING').length;

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Liste d'Appels</h1>
            <p className="text-gray-600 mt-1">Planifiez et suivez vos appels commerciaux</p>
          </div>
        </div>
        <ErrorDisplay 
          error={error} 
          onRetry={handleRefresh}
          className="max-w-2xl mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-brand-sky/30">
        <div>
          <h1 className="text-4xl font-bold text-brand-navy bg-gradient-to-r from-brand-navy to-brand-blue bg-clip-text text-transparent">
            Liste d'Appels
          </h1>
          <p className="text-brand-navy/70 mt-2 text-lg">Planifiez et suivez vos appels commerciaux</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:border-brand-navy hover:scale-105 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isLoading ? 'Actualisation...' : 'Actualiser'}
          </Button>
          <Button className="bg-brand-navy hover:bg-brand-blue text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Appel
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner message="Chargement des appels..." />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-brand-light-blue">{pendingCalls}</div>
                <div className="text-sm text-brand-navy/70 font-medium">En attente</div>
              </div>
              <Clock className="h-8 w-8 text-brand-light-blue" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{completedCalls}</div>
                <div className="text-sm text-brand-navy/70 font-medium">Terminés</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hexagon-decoration">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-600">{highPriorityCalls}</div>
                <div className="text-sm text-brand-navy/70 font-medium">Haute Priorité</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-brand-navy">{calls.length}</div>
                <div className="text-sm text-brand-navy/70 font-medium">Total</div>
              </div>
              <Phone className="h-8 w-8 text-brand-navy" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-blue h-5 w-5" />
          <Input
            placeholder="Rechercher des appels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-brand-sky bg-white/80 backdrop-blur-sm shadow-md focus:ring-brand-blue focus:border-brand-blue"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 h-12 border-brand-sky bg-white/80 backdrop-blur-sm shadow-md focus:ring-brand-blue focus:border-brand-blue">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="completed">Terminés</SelectItem>
            <SelectItem value="cancelled">Annulés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {filteredCalls.length === 0 && !isLoading && (
        <EmptyState
          title={searchTerm ? `Aucun appel trouvé pour "${searchTerm}"` : "Aucun appel planifié"}
          description={searchTerm ? "Essayez de modifier votre recherche." : "Commencez par planifier votre premier appel."}
          icon={Phone}
          action={searchTerm ? undefined : {
            label: "Planifier un appel",
            onClick: () => console.log('Add call clicked')
          }}
        />
      )}

      {/* Calls List */}
      <div className="space-y-4">
        {filteredCalls.map((call) => (
          <Card key={call.id} className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 bg-logo-watermark">
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="font-bold text-xl text-brand-navy">{call.customerName}</h3>
                    <Badge className={getPriorityColor(call.priority)}>
                      {getPriorityLabel(call.priority)}
                    </Badge>
                    <div className="flex items-center space-x-2 bg-white/50 px-3 py-1 rounded-full">
                      {getStatusIcon(call.status)}
                      <span className="text-sm text-brand-navy/80 font-medium">
                        {getStatusLabel(call.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-brand-navy/80 mb-3 text-lg font-medium">{call.objective}</div>
                  
                  <div className="text-sm text-brand-navy/70 mb-3 bg-brand-sky/20 px-3 py-2 rounded-lg">
                    <strong>Programmé:</strong> {formatDateTime(call.scheduledDate)}
                  </div>
                  
                  {call.notes && (
                    <div className="text-sm text-brand-navy bg-white/60 p-3 rounded-xl border border-brand-sky/30">
                      <strong>Notes:</strong> {call.notes}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-3 ml-6">
                  {call.status === 'PENDING' && (
                    <>
                      <Button 
                        size="sm"
                        onClick={() => handleCallCustomer(call)}
                        disabled={isLoading}
                        className="bg-brand-navy hover:bg-brand-blue hover:scale-105 transition-all duration-200"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        {isLoading ? 'Appel...' : 'Appeler'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCompleteCall(call)}
                        disabled={isLoading}
                        className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:scale-105 transition-all duration-200"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Terminer
                      </Button>
                    </>
                  )}
                  {call.status === 'COMPLETED' && (
                    <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 hover:scale-105 transition-all duration-200">
                      <Clock className="h-4 w-4 mr-1" />
                      {call.duration ? `${call.duration}min` : 'Détails'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
