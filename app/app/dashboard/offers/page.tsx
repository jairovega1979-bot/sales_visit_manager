
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateMockOffers, formatCurrency, formatDate } from '@/lib/utils';
import { CompetitiveAnalysisModal } from '@/components/offers/competitive-analysis-modal';
import { Search, Plus, FileText, Clock, CheckCircle, XCircle, Euro, Bot, BarChart3 } from 'lucide-react';

const extendedMockOffers = [
  {
    id: '1',
    offerName: 'Solution CRM Enterprise',
    customerName: 'Nestlé Suisse SA',
    amount: 45000,
    status: 'SENT',
    description: 'Implémentation complète CRM avec formation équipe',
    dateSent: new Date('2024-01-20'),
    expectedClose: new Date('2024-02-15')
  },
  {
    id: '2',
    offerName: 'Consulting Digital',
    customerName: 'UBS Genève',
    amount: 28000,
    status: 'NEGOTIATION',
    description: 'Transformation digitale processus de vente',
    dateSent: new Date('2024-01-15'),
    expectedClose: new Date('2024-02-28')
  },
  {
    id: '3',
    offerName: 'Formation Équipe Vente',
    customerName: 'Swiss Re',
    amount: 15000,
    status: 'SENT',
    description: 'Programme de formation techniques de vente avancées',
    dateSent: new Date('2024-01-25'),
    expectedClose: new Date('2024-03-01')
  },
  {
    id: '4',
    offerName: 'Audit Processus Commercial',
    customerName: 'Roche Pharmaceuticals',
    amount: 22000,
    status: 'WON',
    description: 'Analyse complète des processus de vente existants',
    dateSent: new Date('2024-01-10'),
    expectedClose: new Date('2024-01-30')
  },
  {
    id: '5',
    offerName: 'Solution Analytics',
    customerName: 'Credit Suisse',
    amount: 38000,
    status: 'LOST',
    description: 'Plateforme analytics pour équipe commerciale',
    dateSent: new Date('2024-01-05'),
    expectedClose: new Date('2024-01-20')
  }
];

export default function OffersPage() {
  const [offers] = useState(extendedMockOffers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [competitiveAnalysisOpen, setCompetitiveAnalysisOpen] = useState(false);
  const [selectedOfferForAnalysis, setSelectedOfferForAnalysis] = useState<any>(null);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.offerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT': return 'bg-brand-sky/50 text-brand-navy border border-brand-blue/30';
      case 'NEGOTIATION': return 'bg-yellow-50 text-yellow-800 border border-yellow-200';
      case 'WON': return 'bg-green-50 text-green-800 border border-green-200';
      case 'LOST': return 'bg-red-50 text-red-800 border border-red-200';
      default: return 'bg-brand-sky/30 text-brand-navy border border-brand-sky/50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SENT': return 'Envoyé';
      case 'NEGOTIATION': return 'Négociation';
      case 'WON': return 'Gagné';
      case 'LOST': return 'Perdu';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'NEGOTIATION': return <FileText className="h-4 w-4 text-yellow-500" />;
      case 'WON': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'LOST': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const totalValue = offers.reduce((sum, offer) => sum + offer.amount, 0);
  const wonValue = offers.filter(o => o.status === 'WON').reduce((sum, offer) => sum + offer.amount, 0);
  const pendingOffers = offers.filter(o => o.status === 'SENT' || o.status === 'NEGOTIATION').length;
  const winRate = Math.round((offers.filter(o => o.status === 'WON').length / offers.length) * 100);

  const openCompetitiveAnalysis = (offer: any) => {
    setSelectedOfferForAnalysis(offer);
    setCompetitiveAnalysisOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-brand-sky/30 space-y-4 sm:space-y-0">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy bg-gradient-to-r from-brand-navy to-brand-blue bg-clip-text text-transparent break-words">
              Offres Commerciales
            </h1>
            <p className="text-brand-navy/70 mt-1 sm:mt-2 text-sm sm:text-base md:text-lg">Gérez et suivez vos propositions commerciales</p>
          </div>
          <Button className="bg-brand-navy hover:bg-brand-blue text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="sm:hidden">Créer une nouvelle offre</span>
            <span className="hidden sm:inline">Nouvelle Offre</span>
          </Button>
        </div>

        {/* New AI Feature Highlight */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">🚀 Nouvelle Fonctionnalité IA</h3>
                  <p className="text-sm text-purple-700">
                    Analysez automatiquement la concurrence pour chaque offre grâce à notre agent IA intelligent
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-600 font-medium">
                <BarChart3 className="h-4 w-4" />
                Analyse Web Automatique
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards - Mobile Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hexagon-decoration">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-brand-navy truncate">{formatCurrency(totalValue)}</div>
                <div className="text-xs sm:text-sm text-brand-navy/70 font-medium">Valeur Totale</div>
              </div>
              <Euro className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-brand-navy flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-600 truncate">{formatCurrency(wonValue)}</div>
                <div className="text-xs sm:text-sm text-brand-navy/70 font-medium">Offres Gagnées</div>
              </div>
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-green-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-light-blue">{pendingOffers}</div>
                <div className="text-xs sm:text-sm text-brand-navy/70 font-medium">En cours</div>
              </div>
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-brand-light-blue flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-blue">{winRate}%</div>
                <div className="text-xs sm:text-sm text-brand-navy/70 font-medium">Taux de Réussite</div>
              </div>
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-brand-blue flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-blue h-5 w-5" />
          <Input
            placeholder="Rechercher des offres..."
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
            <SelectItem value="sent">Envoyé</SelectItem>
            <SelectItem value="negotiation">Négociation</SelectItem>
            <SelectItem value="won">Gagné</SelectItem>
            <SelectItem value="lost">Perdu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Offers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-logo-watermark">
            <CardHeader className="bg-brand-gradient-soft rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-brand-navy font-bold">{offer.offerName}</CardTitle>
                  <div className="text-sm text-brand-navy/70 mt-1 font-medium">{offer.customerName}</div>
                </div>
                <Badge className={getStatusColor(offer.status)}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(offer.status)}
                    <span>{getStatusLabel(offer.status)}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 relative z-10">
              <div className="space-y-4">
                <div className="text-3xl font-bold text-brand-blue bg-brand-sky/20 px-4 py-2 rounded-xl text-center">
                  {formatCurrency(offer.amount)}
                </div>
                
                <div className="text-sm text-brand-navy/80 bg-white/60 p-3 rounded-xl">
                  {offer.description}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/60 p-3 rounded-xl">
                    <span className="font-semibold text-brand-navy">Date envoi:</span>
                    <div className="text-brand-navy/80 mt-1">{formatDate(offer.dateSent)}</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl">
                    <span className="font-semibold text-brand-navy">Clôture prévue:</span>
                    <div className="text-brand-navy/80 mt-1">{formatDate(offer.expectedClose)}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {/* Bouton d'analyse concurrentielle - disponible pour toutes les offres */}
                  <Button 
                    size="sm" 
                    onClick={() => openCompetitiveAnalysis(offer)}
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1 hover:scale-105 transition-all duration-200"
                  >
                    <Bot className="h-3 w-3" />
                    Analyse IA
                  </Button>

                  {/* Boutons spécifiques par statut */}
                  {offer.status === 'SENT' && (
                    <>
                      <Button size="sm" className="bg-brand-navy hover:bg-brand-blue hover:scale-105 transition-all duration-200">Suivre</Button>
                      <Button size="sm" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:scale-105 transition-all duration-200">Modifier</Button>
                    </>
                  )}
                  {offer.status === 'NEGOTIATION' && (
                    <>
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 hover:scale-105 transition-all duration-200">Négocier</Button>
                      <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 hover:scale-105 transition-all duration-200">Finaliser</Button>
                    </>
                  )}
                  {(offer.status === 'WON' || offer.status === 'LOST') && (
                    <Button size="sm" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:scale-105 transition-all duration-200">Voir détails</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal d'analyse concurrentielle */}
      {selectedOfferForAnalysis && (
        <CompetitiveAnalysisModal
          isOpen={competitiveAnalysisOpen}
          onClose={() => {
            setCompetitiveAnalysisOpen(false);
            setSelectedOfferForAnalysis(null);
          }}
          offer={selectedOfferForAnalysis}
        />
      )}
    </div>
  );
}
