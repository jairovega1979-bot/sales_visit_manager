
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Plus, MapPin, Phone, Mail, Users, TrendingUp } from 'lucide-react';
import { Customer, CustomerStats } from '@/lib/types';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useToast } from '@/hooks/useToast';
import { 
  LoadingSpinner, 
  LoadingOverlay, 
  RefreshButton, 
  EmptyState, 
  StatusIndicator 
} from '@/components/ui/loading-states';
import { 
  AnimatedButton, 
  HoverCard, 
  PulseBadge, 
  FadeIn 
} from '@/components/ui/micro-interactions';

interface CustomersClientProps {
  customers: Customer[];
  stats: CustomerStats;
  onRefresh?: () => Promise<void>;
}

export function CustomersClient({ customers, stats, onRefresh }: CustomersClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const { isLoading, error, executeAsync, clearError } = useLoadingState();
  const { success, error: errorToast, info } = useToast();

  // Filtrage optimisé avec useMemo
  const filteredCustomers = useMemo(() => {
    try {
      if (!Array.isArray(customers)) {
        console.warn('Customers data is not an array:', customers);
        return [];
      }
      
      if (!searchTerm.trim()) return customers;
      
      return customers.filter(customer => {
        if (!customer || typeof customer.customerName !== 'string') {
          console.warn('Invalid customer data:', customer);
          return false;
        }
        
        const nameMatch = customer.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const locationMatch = (customer.location || '').toLowerCase().includes(searchTerm.toLowerCase());
        const segmentMatch = (customer.customerSegment || '').toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || locationMatch || segmentMatch;
      });
    } catch (err) {
      console.error('Error filtering customers:', err);
      errorToast('Erreur lors du filtrage des clients');
      return [];
    }
  }, [customers, searchTerm, errorToast]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'POTENTIAL': return 'Prospect';
      case 'INACTIVE': return 'Inactif';
      case 'LEAD': return 'Lead';
      default: return status || 'Inconnu';
    }
  };

  const getSegmentLabel = (segment: string) => {
    switch (segment) {
      case 'LARGE_ENTERPRISE': return 'Grande Entreprise';
      case 'SME': return 'PME';
      case 'B2B': return 'B2B';
      case 'B2C': return 'B2C';
      default: return segment || 'Non spécifié';
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      await executeAsync(
        onRefresh,
        {
          loadingMessage: 'Actualisation des clients...',
          successMessage: 'Liste des clients mise à jour',
          errorMessage: 'Impossible de mettre à jour la liste'
        }
      );
    }
  };

  const handleCallCustomer = async (customer: Customer) => {
    setActionLoading(customer.id);
    
    const result = await executeAsync(
      async () => {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      },
      {
        successMessage: `Appel programmé vers ${customer.customerName}`,
        errorMessage: 'Impossible de programmer l\'appel'
      }
    );

    setActionLoading(null);
    return result;
  };

  const handleVisitCustomer = async (customer: Customer) => {
    setActionLoading(customer.id);
    
    const result = await executeAsync(
      async () => {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true };
      },
      {
        successMessage: `Visite planifiée chez ${customer.customerName}`,
        errorMessage: 'Impossible de programmer la visite'
      }
    );

    setActionLoading(null);
    return result;
  };

  // Handle error state
  if (error) {
    return (
      <FadeIn>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
              <p className="text-gray-600 mt-1">Gérez votre portefeuille client</p>
            </div>
          </div>
          <StatusIndicator 
            status="error"
            message={error}
            className="max-w-2xl mx-auto"
          />
          <div className="flex justify-center">
            <RefreshButton
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="space-y-6 relative">
        {/* Loading overlay pour les opérations globales */}
        <LoadingOverlay 
          isVisible={isLoading} 
          message="Chargement des clients..." 
        />
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-gray-600">Gérez votre portefeuille client</p>
                {filteredCustomers.length > 0 && (
                  <PulseBadge color="blue">
                    {filteredCustomers.length} client{filteredCustomers.length > 1 ? 's' : ''}
                  </PulseBadge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <RefreshButton
                onRefresh={handleRefresh}
                isLoading={isLoading}
                className="mr-2"
              />
            )}
            <AnimatedButton>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Client
            </AnimatedButton>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats?.total ?? 0}
                </div>
                <div className="text-sm text-gray-600">Total Clients</div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats?.active ?? 0}
                </div>
                <div className="text-sm text-gray-600">Clients Actifs</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {stats?.potential ?? 0}
                </div>
                <div className="text-sm text-gray-600">Prospects</div>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats?.totalValue ?? 0)}
                </div>
                <div className="text-sm text-gray-600">Valeur Portfolio</div>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner />}

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher des clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer, index) => (
          <FadeIn key={customer.id} delay={index * 100}>
            <HoverCard hoverEffect="lift">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{customer.customerName}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {customer.location}
                  </div>
                </div>
                <Badge variant={customer.customerStatus === 'ACTIVE' ? 'default' : 'secondary'}>
                  {getStatusLabel(customer.customerStatus)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Principal: {customer.mainContact}
                  </div>
                  {customer.contactEmail && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {customer.contactEmail}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Segment:</span>
                    <div className="text-gray-600">{getSegmentLabel(customer.customerSegment)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Ventes:</span>
                    <div className="text-green-600 font-semibold">
                      {formatCurrency(customer.salesHistory || 0)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Potentiel:</span>
                    <div className="text-blue-600 font-semibold">
                      {formatCurrency(customer.potentialGrowth || 0)}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Dernière visite:</span>
                    <div className="text-gray-600">
                      {customer.lastVisit ? formatDate(customer.lastVisit) : 'Aucune'}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="text-xs text-gray-500 mb-2">Offres actives:</div>
                  <div className="text-sm text-gray-700">{customer.activeOfferings || 'Aucune'}</div>
                </div>

                {customer.commercialNotes && (
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-500 mb-1">Notes commerciales:</div>
                    <div className="text-sm text-gray-700">{customer.commercialNotes}</div>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <AnimatedButton 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCallCustomer(customer)}
                    disabled={actionLoading === customer.id}
                    animationType="pulse"
                  >
                    {actionLoading === customer.id ? (
                      <>
                        <LoadingSpinner className="mr-1" />
                        Appel en cours...
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-1" />
                        Appeler
                      </>
                    )}
                  </AnimatedButton>
                  <AnimatedButton 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleVisitCustomer(customer)}
                    disabled={actionLoading === customer.id}
                    animationType="scale"
                  >
                    {actionLoading === customer.id ? (
                      <>
                        <LoadingSpinner className="mr-1" />
                        Planification...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-1" />
                        Visiter
                      </>
                    )}
                  </AnimatedButton>
                </div>
              </div>
            </CardContent>
            </HoverCard>
          </FadeIn>
        ))}
      </div>

      {filteredCustomers.length === 0 && !isLoading && (
        <EmptyState
          title={searchTerm ? `Aucun client trouvé pour "${searchTerm}"` : "Aucun client"}
          description={searchTerm ? "Essayez de modifier votre recherche." : "Commencez par ajouter votre premier client."}
          icon={Users}
          action={searchTerm ? undefined : {
            label: "Ajouter un client",
            onClick: () => console.log('Add customer clicked')
          }}
        />
      )}
      </div>
    </FadeIn>
  );
}
