
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Plus, FileText, Clock, CheckCircle, XCircle, Euro, TrendingUp } from 'lucide-react';
import { OfferWithCustomer, OfferStats } from '@/lib/types';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ErrorDisplay, LoadingSpinner, EmptyState } from '@/components/ui/error-display';

interface OffersClientProps {
  offers: OfferWithCustomer[];
  stats: OfferStats;
  onRefresh?: () => Promise<void>;
}

export function OffersClient({ offers, stats, onRefresh }: OffersClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { isLoading, error, executeWithErrorHandling, clearError } = useErrorHandler();

  // Safe filtering with error handling
  const filteredOffers = (() => {
    try {
      if (!Array.isArray(offers)) {
        console.warn('Offers data is not an array:', offers);
        return [];
      }
      
      return offers.filter(offer => {
        if (!offer || typeof offer.offerName !== 'string') {
          console.warn('Invalid offer data:', offer);
          return false;
        }
        
        const nameMatch = offer.offerName.toLowerCase().includes(searchTerm.toLowerCase());
        const customerMatch = (offer.customerName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = nameMatch || customerMatch;
        const matchesStatus = statusFilter === 'all' || offer.status === statusFilter.toUpperCase();
        return matchesSearch && matchesStatus;
      });
    } catch (err) {
      console.error('Error filtering offers:', err);
      return [];
    }
  })();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'NEGOTIATION': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SENT': return 'Envoyé';
      case 'NEGOTIATION': return 'Négociation';
      case 'ACCEPTED': return 'Accepté';
      case 'REJECTED': return 'Refusé';
      case 'DRAFT': return 'Brouillon';
      case 'CANCELLED': return 'Annulé';
      default: return status || 'Inconnu';
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      await executeWithErrorHandling(
        onRefresh,
        () => clearError(),
        (error) => console.error('Failed to refresh offers:', error)
      );
    }
  };

  const handleEditOffer = async (offer: OfferWithCustomer) => {
    console.log('Editing offer:', offer.offerName);
  };

  const handleDeleteOffer = async (offer: OfferWithCustomer) => {
    console.log('Deleting offer:', offer.offerName);
  };

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Offres</h1>
            <p className="text-gray-600 mt-1">Gérez vos propositions commerciales</p>
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'NEGOTIATION': return <FileText className="h-4 w-4 text-yellow-500" />;
      case 'ACCEPTED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'DRAFT': return <FileText className="h-4 w-4 text-gray-500" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offres</h1>
          <p className="text-gray-600 mt-1">Gérez vos propositions commerciales</p>
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <Button 
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {isLoading ? 'Actualisation...' : 'Actualiser'}
            </Button>
          )}
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Offre
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner message="Chargement des offres..." />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats?.total ?? 0}
                </div>
                <div className="text-sm text-gray-600">Total Offres</div>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {stats?.pending ?? 0}
                </div>
                <div className="text-sm text-gray-600">En Attente</div>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats?.accepted ?? 0}
                </div>
                <div className="text-sm text-gray-600">Acceptées</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
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
                <div className="text-sm text-gray-600">Valeur Totale</div>
              </div>
              <Euro className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher des offres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
            <SelectItem value="sent">Envoyées</SelectItem>
            <SelectItem value="negotiation">Négociation</SelectItem>
            <SelectItem value="accepted">Acceptées</SelectItem>
            <SelectItem value="rejected">Refusées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {filteredOffers.length === 0 && !isLoading && (
        <EmptyState
          title={searchTerm ? `Aucune offre trouvée pour "${searchTerm}"` : "Aucune offre"}
          description={searchTerm ? "Essayez de modifier votre recherche." : "Commencez par créer votre première offre."}
          icon={FileText}
          action={searchTerm ? undefined : {
            label: "Créer une offre",
            onClick: () => console.log('Add offer clicked')
          }}
        />
      )}

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-semibold text-lg">{offer.offerName}</h3>
                    <Badge className={getStatusColor(offer.status)}>
                      {getStatusLabel(offer.status)}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(offer.status)}
                    </div>
                  </div>
                  
                  <div className="text-gray-700 mb-2">
                    Client: {offer.customerName}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium">Montant:</span>
                      <div className="text-green-600 font-semibold">
                        {formatCurrency(offer.amount)} {offer.currency}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium">Probabilité:</span>
                      <div className="text-blue-600 font-semibold">
                        {offer.probability}%
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium">Clôture prévue:</span>
                      <div className="text-gray-600">
                        {formatDate(offer.expectedClose)}
                      </div>
                    </div>
                  </div>
                  
                  {offer.description && (
                    <div className="text-sm text-gray-600 mb-3">
                      <strong>Description:</strong> {offer.description}
                    </div>
                  )}
                  
                  {offer.nextAction && (
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <strong>Prochaine action:</strong> {offer.nextAction}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 ml-6">
                  <Button 
                    size="sm"
                    onClick={() => executeWithErrorHandling(
                      () => handleEditOffer(offer),
                      () => console.log('Edit initiated'),
                      (error) => console.error('Failed to edit offer:', error)
                    )}
                    disabled={isLoading}
                  >
                    Modifier
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => executeWithErrorHandling(
                      () => handleDeleteOffer(offer),
                      () => console.log('Delete initiated'),
                      (error) => console.error('Failed to delete offer:', error)
                    )}
                    disabled={isLoading}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
