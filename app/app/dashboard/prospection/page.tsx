

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Phone, 
  UserPlus, 
  ExternalLink,
  MapPin,
  Building,
  TrendingUp,
  Target,
  Users,
  Globe,
  Calendar,
  Star
} from 'lucide-react';
import { MockProspect, ProspectPriority, ProspectSource, IntentSignal } from '@/lib/mock-data';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProspectsStats {
  totalProspects: number;
  totalEstimatedRevenue: number;
  avgFitScore: number;
  byPriority: Record<ProspectPriority, number>;
  bySource: Record<ProspectSource, number>;
}

// Cantones suizos disponibles
const SWISS_CANTONS = [
  { code: 'ZH', name: 'Zurich' },
  { code: 'BE', name: 'Berne' },
  { code: 'LU', name: 'Lucerne' },
  { code: 'UR', name: 'Uri' },
  { code: 'SZ', name: 'Schwyz' },
  { code: 'OW', name: 'Obwald' },
  { code: 'NW', name: 'Nidwald' },
  { code: 'GL', name: 'Glaris' },
  { code: 'ZG', name: 'Zoug' },
  { code: 'FR', name: 'Fribourg' },
  { code: 'SO', name: 'Soleure' },
  { code: 'BS', name: 'Bâle-Ville' },
  { code: 'BL', name: 'Bâle-Campagne' },
  { code: 'SH', name: 'Schaffhouse' },
  { code: 'AR', name: 'Appenzell Rhodes-Extérieures' },
  { code: 'AI', name: 'Appenzell Rhodes-Intérieures' },
  { code: 'SG', name: 'Saint-Gall' },
  { code: 'GR', name: 'Grisons' },
  { code: 'AG', name: 'Argovie' },
  { code: 'TG', name: 'Thurgovie' },
  { code: 'TI', name: 'Tessin' },
  { code: 'VD', name: 'Vaud' },
  { code: 'VS', name: 'Valais' },
  { code: 'NE', name: 'Neuchâtel' },
  { code: 'GE', name: 'Genève' },
  { code: 'JU', name: 'Jura' }
];

export default function ProspectionPage() {
  const [prospects, setProspects] = useState<MockProspect[]>([]);
  const [filteredProspects, setFilteredProspects] = useState<MockProspect[]>([]);
  const [stats, setStats] = useState<ProspectsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [minFitScore, setMinFitScore] = useState<string>('');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // IA search states
  const [searchSector, setSearchSector] = useState<string>('');
  const [selectedCantons, setSelectedCantons] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAISearch, setShowAISearch] = useState(false);
  const [discoveredProspects, setDiscoveredProspects] = useState<MockProspect[]>([]);

  useEffect(() => {
    fetchProspects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [prospects, searchQuery, selectedPriority, selectedSource, selectedIndustry, minFitScore]);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prospects');
      const data = await response.json();
      setProspects(data.prospects || []);
      setStats(data.stats);
    } catch (error) {
      console.error('Erreur lors du chargement des prospects:', error);
      showNotification('error', 'Erreur lors du chargement des prospects');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...prospects];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prospect =>
        prospect.companyName.toLowerCase().includes(query) ||
        prospect.industry.toLowerCase().includes(query) ||
        prospect.location.toLowerCase().includes(query) ||
        prospect.mainContact?.toLowerCase().includes(query) ||
        prospect.description?.toLowerCase().includes(query)
      );
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(prospect => prospect.priority === selectedPriority);
    }

    // Source filter
    if (selectedSource !== 'all') {
      filtered = filtered.filter(prospect => prospect.source === selectedSource);
    }

    // Industry filter
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(prospect => 
        prospect.industry.toLowerCase().includes(selectedIndustry.toLowerCase())
      );
    }

    // Fit score filter
    if (minFitScore) {
      const minScore = parseInt(minFitScore);
      filtered = filtered.filter(prospect => prospect.fitScore >= minScore);
    }

    setFilteredProspects(filtered);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCall = (prospect: MockProspect) => {
    // In demo mode, simulate call action
    showNotification('success', `Appel programmé avec ${prospect.mainContact} de ${prospect.companyName}`);
  };

  const handleAddToCRM = async (prospect: MockProspect) => {
    try {
      const response = await fetch(`/api/prospects/${prospect.id}/convert`, {
        method: 'POST'
      });
      
      if (response.ok) {
        showNotification('success', `${prospect.companyName} ajouté au CRM avec succès`);
        // Refresh prospects list
        fetchProspects();
      } else {
        showNotification('error', 'Erreur lors de l\'ajout au CRM');
      }
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'ajout au CRM');
    }
  };

  const handleCantonToggle = (cantonCode: string) => {
    setSelectedCantons(prev => 
      prev.includes(cantonCode) 
        ? prev.filter(c => c !== cantonCode)
        : [...prev, cantonCode]
    );
  };

  const handleAISearch = async () => {
    if (!searchSector.trim()) {
      showNotification('error', 'Veuillez spécifier un secteur d\'activité');
      return;
    }

    if (selectedCantons.length === 0) {
      showNotification('error', 'Veuillez sélectionner au moins un canton');
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch('/api/prospects/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sector: searchSector.trim(),
          cantons: selectedCantons,
          limit: 5,
          aiSearch: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDiscoveredProspects(data.prospects);
        
        // Create detailed success message
        const cantonsNames = selectedCantons.map(code => {
          const canton = SWISS_CANTONS.find(c => c.code === code);
          return canton?.name || code;
        }).join(', ');
        
        showNotification('success', 
          `L'IA a découvert ${data.prospects.length} entreprises "${searchSector}" uniques dans les cantons: ${cantonsNames}`
        );
        
        // Reset form but keep AI search panel open to show results
        setSearchSector('');
        setSelectedCantons([]);
        // Don't close the panel to show results: setShowAISearch(false);
      } else {
        const errorData = await response.json();
        showNotification('error', errorData.error || 'Erreur lors de la recherche IA');
      }
    } catch (error) {
      showNotification('error', 'Erreur lors de la recherche IA');
    } finally {
      setIsSearching(false);
    }
  };

  const uniqueIndustries = [...new Set(prospects.map(p => p.industry))];

  // Helper functions for styling
  const getPriorityColor = (priority: ProspectPriority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceIcon = (source: ProspectSource) => {
    switch (source) {
      case 'WEB_SEARCH': return <Search className="w-4 h-4" />;
      case 'DIRECTORY': return <Building className="w-4 h-4" />;
      case 'REFERRAL': return <Users className="w-4 h-4" />;
      case 'SOCIAL_MEDIA': return <Globe className="w-4 h-4" />;
      case 'EVENT': return <Calendar className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getIntentSignalColor = (signal: IntentSignal) => {
    switch (signal) {
      case 'FUNDING': return 'bg-green-100 text-green-800';
      case 'JOB_POSTING': return 'bg-blue-100 text-blue-800';
      case 'EXPANSION': return 'bg-purple-100 text-purple-800';
      case 'TECHNOLOGY_ADOPTION': return 'bg-indigo-100 text-indigo-800';
      case 'COMPETITOR_MENTION': return 'bg-orange-100 text-orange-800';
      case 'INDUSTRY_NEWS': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des prospects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Module Prospection</h1>
          <p className="text-gray-600 mt-1">
            Découverte et qualification de nouveaux prospects B2B
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowAISearch(!showAISearch)}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Search className="w-4 h-4 mr-2" />
            Recherche IA Internet
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Nouveau Prospect
          </Button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Alert className={notification.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription className={notification.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {notification.message}
          </AlertDescription>
        </Alert>
      )}

      {/* AI Search Section */}
      {showAISearch && (
        <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Search className="w-5 h-5 mr-2" />
            Recherche IA de Prospects sur Internet
          </CardTitle>
          <CardDescription>
            L'agent IA cherchera 5 entreprises non présentes dans votre base de données selon vos critères
          </CardDescription>
        </CardHeader>
          <CardContent className="space-y-6">
            {/* Título de configuración */}
            <div className="text-center border-b pb-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Configuration de Recherche IA</h3>
              <p className="text-sm text-gray-600">Configurez les critères pour que l'IA trouve 5 entreprises uniques sur internet</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Secteur Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-blue-700 mb-2 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Secteur d'activité *
                </label>
                <Input
                  placeholder="Ex: Technologie, Finance, Santé, Immobilier, Construction..."
                  value={searchSector}
                  onChange={(e) => setSearchSector(e.target.value)}
                  className="w-full border-blue-200 focus:border-blue-500"
                  disabled={isSearching}
                />
                <div className="text-xs text-gray-500">
                  Secteurs populaires: Technologie, Finance, Santé, Immobilier, Construction, Consulting, Manufacturing
                </div>
              </div>
              
              {/* Canton Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-blue-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Cantons suisses * (sélection multiple)
                </label>
                <div className="max-h-40 overflow-y-auto border border-blue-200 rounded-md p-3 bg-white">
                  <div className="grid grid-cols-2 gap-2">
                    {SWISS_CANTONS.map(canton => (
                      <label key={canton.code} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedCantons.includes(canton.code)}
                          onChange={() => handleCantonToggle(canton.code)}
                          disabled={isSearching}
                          className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs font-medium">{canton.code}</span>
                        <span className="text-xs text-gray-600">{canton.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {selectedCantons.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 mb-2">Cantons sélectionnés ({selectedCantons.length}):</div>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                      {selectedCantons.map(code => {
                        const canton = SWISS_CANTONS.find(c => c.code === code);
                        return (
                          <Badge key={code} variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                            {canton?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
                {selectedCantons.length === 0 && (
                  <div className="text-xs text-gray-500">
                    Choisissez un ou plusieurs cantons pour cibler votre recherche
                  </div>
                )}
              </div>
            </div>

            {/* Boutons de sélection rapide pour cantones */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Sélections rapides:</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCantons(['ZH', 'GE', 'VD'])}
                  disabled={isSearching}
                  className="text-xs"
                >
                  Grandes villes (ZH, GE, VD)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCantons(['ZH', 'BE', 'VD', 'AG', 'SG'])}
                  disabled={isSearching}
                  className="text-xs"
                >
                  Cantons économiques (5)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCantons(['GE', 'VD', 'NE', 'JU', 'FR', 'VS'])}
                  disabled={isSearching}
                  className="text-xs"
                >
                  Suisse Romande
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCantons([])}
                  disabled={isSearching}
                  className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                >
                  Effacer sélection
                </Button>
              </div>
            </div>

            {/* Resumen de criterios configurados */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-800 mb-2">Critères de recherche configurés:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Secteur:</span>
                  <span className="ml-2 text-blue-700">
                    {searchSector.trim() || '(Non spécifié)'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Cantons:</span>
                  <span className="ml-2 text-blue-700">
                    {selectedCantons.length > 0 
                      ? `${selectedCantons.length} sélectionné(s): ${selectedCantons.join(', ')}`
                      : '(Aucun sélectionné)'
                    }
                  </span>
                </div>
              </div>
              {(searchSector.trim() && selectedCantons.length > 0) && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                  ✅ Configuration prête - L'IA recherchera des entreprises "{searchSector}" dans {selectedCantons.length} canton(s)
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 max-w-md">
                <strong>L'IA analysera:</strong> Annuaires d'entreprises, réseaux professionnels, registres commerciaux et sources publiques pour identifier 5 prospects uniques non présents dans votre CRM.
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleAISearch}
                  disabled={isSearching || !searchSector.trim() || selectedCantons.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      IA en cours...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Lancer Recherche IA
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAISearch(false);
                    setSearchSector('');
                    setSelectedCantons([]);
                  }}
                  disabled={isSearching}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discovered Prospects Section */}
      {discoveredProspects.length > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Star className="w-5 h-5 mr-2" />
              Prospects Découverts par l'IA ({discoveredProspects.length})
            </CardTitle>
            <CardDescription>
              Nouvelles entreprises trouvées sur internet et vérifiées comme non présentes dans votre CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {discoveredProspects.map((prospect) => (
                <div key={prospect.id} className="border border-green-200 rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{prospect.companyName}</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          DÉCOUVERT IA
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          {prospect.location}
                        </Badge>
                        <Badge className={getPriorityColor(prospect.priority)}>
                          {prospect.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>{prospect.industry}</span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {prospect.location}
                        </span>
                        <span className="flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {prospect.companySize} employés
                        </span>
                      </div>
                      {prospect.description && (
                        <p className="text-sm text-gray-700 mb-2">{prospect.description}</p>
                      )}
                      {prospect.mainContact && (
                        <div className="text-sm">
                          <strong>Contact:</strong> {prospect.mainContact}
                          {prospect.contactEmail && (
                            <span className="text-gray-600 ml-2">({prospect.contactEmail})</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600 mb-1">
                        Score: {prospect.fitScore}%
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        Contactabilité: {prospect.contactability}%
                      </div>
                      <div className="text-sm font-medium text-green-700">
                        Revenus: {new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(prospect.estimatedRevenue)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-green-200">
                    <div className="text-xs text-gray-500">
                      Découvert: {new Date(prospect.discoveredAt).toLocaleDateString('fr-CH')}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCall(prospect)}
                        className="flex items-center"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Appeler
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCRM(prospect)}
                        className="bg-green-600 hover:bg-green-700 flex items-center"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Ajouter au CRM
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-green-200 text-center">
              <Button
                variant="outline"
                onClick={() => setDiscoveredProspects([])}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                Effacer les prospects découverts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prospects</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProspects}</div>
              <p className="text-xs text-muted-foreground">
                Prospects actifs découverts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenu Estimé</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' })
                  .format(stats.totalEstimatedRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Potentiel total du pipeline
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgFitScore}%</div>
              <p className="text-xs text-muted-foreground">
                Ajustement au profil ideal
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Priorité Haute</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.byPriority.HIGH + stats.byPriority.CRITICAL}
              </div>
              <p className="text-xs text-muted-foreground">
                Prospects à contacter rapidement
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Recherche et Filtres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="Rechercher prospects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes Priorités</SelectItem>
                <SelectItem value="CRITICAL">Critique</SelectItem>
                <SelectItem value="HIGH">Haute</SelectItem>
                <SelectItem value="MEDIUM">Moyenne</SelectItem>
                <SelectItem value="LOW">Basse</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes Sources</SelectItem>
                <SelectItem value="WEB_SEARCH">Recherche Web</SelectItem>
                <SelectItem value="DIRECTORY">Annuaire</SelectItem>
                <SelectItem value="REFERRAL">Référence</SelectItem>
                <SelectItem value="SOCIAL_MEDIA">Réseaux Sociaux</SelectItem>
                <SelectItem value="EVENT">Événement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Industrie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes Industries</SelectItem>
                {uniqueIndustries.map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Score minimum:</label>
            <Input
              type="number"
              placeholder="0-100"
              value={minFitScore}
              onChange={(e) => setMinFitScore(e.target.value)}
              className="w-24"
              min="0"
              max="100"
            />
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedPriority('all');
                setSelectedSource('all');
                setSelectedIndustry('all');
                setMinFitScore('');
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prospects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Prospects Découverts ({filteredProspects.length})
          </h2>
        </div>

        {filteredProspects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun prospect trouvé
              </h3>
              <p className="text-gray-500">
                Essayez d'ajuster vos filtres de recherche
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredProspects.map((prospect) => (
              <Card key={prospect.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{prospect.companyName}</CardTitle>
                        <Badge className={getPriorityColor(prospect.priority)}>
                          {prospect.priority}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getSourceIcon(prospect.source)}
                          <span className="text-xs text-gray-500 capitalize">
                            {prospect.source.replace('_', ' ').toLowerCase()}
                          </span>
                        </div>
                      </div>
                      <CardDescription className="flex items-center space-x-4">
                        <span>{prospect.industry}</span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {prospect.location}
                        </span>
                        <span className="flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {prospect.companySize} employés
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-600">
                        Score: {prospect.fitScore}%
                      </div>
                      <div className="text-sm text-gray-500">
                        Contact: {prospect.contactability}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Contact Information */}
                    {prospect.mainContact && (
                      <div className="text-sm">
                        <strong>Contact:</strong> {prospect.mainContact}
                        {prospect.contactEmail && (
                          <span className="text-gray-600 ml-2">({prospect.contactEmail})</span>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {prospect.description && (
                      <p className="text-sm text-gray-700">{prospect.description}</p>
                    )}

                    {/* Intent Signals */}
                    {prospect.intentSignals.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Signaux d'Intention:</div>
                        <div className="flex flex-wrap gap-2">
                          {prospect.intentSignals.map((signal, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className={getIntentSignalColor(signal)}
                            >
                              {signal.replace('_', ' ').toLowerCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evidences */}
                    <div>
                      <div className="text-sm font-medium mb-2">Preuves ({prospect.evidences.length}):</div>
                      <ul className="text-sm space-y-1">
                        {prospect.evidences.map((evidence, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span className="text-gray-700">{evidence}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Revenue & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Revenu Estimé:</strong>{' '}
                        <span className="text-green-600 font-medium">
                          {new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' })
                            .format(prospect.estimatedRevenue)}
                        </span>
                      </div>
                      {prospect.website && (
                        <div>
                          <strong>Site Web:</strong>{' '}
                          <a 
                            href={prospect.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center"
                          >
                            Visiter <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>

                    {prospect.notes && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm font-medium mb-1">Notes:</div>
                        <p className="text-sm text-gray-700">{prospect.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-xs text-gray-500">
                        Découvert: {new Date(prospect.discoveredAt).toLocaleDateString('fr-CH')}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCall(prospect)}
                          className="flex items-center"
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Appeler
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCRM(prospect)}
                          className="bg-green-600 hover:bg-green-700 flex items-center"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Ajouter au CRM
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
