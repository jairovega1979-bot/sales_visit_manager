
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Globe,
  Clock,
  Target,
  Zap,
  BarChart3,
  Eye,
  DollarSign,
  Users,
  Star,
  ExternalLink
} from 'lucide-react';
import { 
  CompetitiveIntelligenceAgent, 
  CompetitiveAnalysis,
  AnalysisProgress,
  AnalysisStatus
} from '@/lib/competitive-analysis';
import { formatCurrency } from '@/lib/utils';

interface CompetitiveAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: {
    id: string;
    offerName: string;
    amount: number;
    description: string;
    customerName: string;
  };
}

export function CompetitiveAnalysisModal({ isOpen, onClose, offer }: CompetitiveAnalysisModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customFeatures, setCustomFeatures] = useState('');
  const [analysis, setAnalysis] = useState<CompetitiveAnalysis | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>({
    status: 'idle',
    progress: 0,
    currentStep: 'Prêt à analyser',
    estimatedTimeRemaining: 0
  });

  // Initialize search query when offer changes
  useEffect(() => {
    if (offer?.offerName && !searchQuery) {
      setSearchQuery(`${offer.offerName} concurrents prix marché`);
    }
  }, [offer, searchQuery]);

  const startAnalysis = async () => {
    if (!searchQuery.trim()) return;

    // Reset previous analysis
    setAnalysis(null);

    // Progress simulation
    const steps = [
      { step: 'Initialisation de l\'agent IA...', progress: 10, time: 5 },
      { step: 'Recherche web des concurrents...', progress: 30, time: 4 },
      { step: 'Analyse des prix et fonctionnalités...', progress: 60, time: 3 },
      { step: 'Génération des recommandations...', progress: 85, time: 2 },
      { step: 'Finalisation du rapport...', progress: 100, time: 0 }
    ];

    setProgress({ status: 'searching', progress: 0, currentStep: steps[0].step, estimatedTimeRemaining: 15 });

    // Simulate progress updates
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setProgress({
        status: i === steps.length - 1 ? 'analyzing' : 'searching',
        progress: step.progress,
        currentStep: step.step,
        estimatedTimeRemaining: step.time
      });
      
      if (i < steps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    try {
      // Extract features from description and custom input
      const features = [
        ...offer.description.split(',').map(f => f.trim()),
        ...customFeatures.split(',').map(f => f.trim()).filter(f => f.length > 0)
      ];

      const ourOffer = {
        name: offer.offerName,
        price: offer.amount,
        features,
        description: offer.description
      };

      const result = await CompetitiveIntelligenceAgent.searchCompetitors(searchQuery, ourOffer);
      setAnalysis(result);
      setProgress({ status: 'completed', progress: 100, currentStep: 'Analyse terminée', estimatedTimeRemaining: 0 });
    } catch (error) {
      setProgress({ status: 'error', progress: 0, currentStep: 'Erreur lors de l\'analyse', estimatedTimeRemaining: 0 });
    }
  };

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'searching':
      case 'analyzing':
        return <Bot className="h-5 w-5 animate-pulse text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Search className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPricePositionIcon = (position: string) => {
    switch (position) {
      case 'above': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'below': return <TrendingDown className="h-4 w-4 text-green-600" />;
      default: return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  const searchSuggestions = CompetitiveIntelligenceAgent.generateSearchSuggestions(offer?.offerName || '');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-navy flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600" />
            Analyse Concurrentielle IA - {offer?.offerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Configuration de la Recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search-query">Requête de recherche</Label>
                <Input
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: CRM enterprise solutions pricing comparison"
                  className="mt-1"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="custom-features">Fonctionnalités supplémentaires (optionnel)</Label>
                <Textarea
                  id="custom-features"
                  value={customFeatures}
                  onChange={(e) => setCustomFeatures(e.target.value)}
                  placeholder="Ajoutez des fonctionnalités spécifiques séparées par des virgules..."
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={startAnalysis}
                  disabled={progress.status === 'searching' || progress.status === 'analyzing' || !searchQuery.trim()}
                  className="flex items-center gap-2"
                >
                  {getStatusIcon()}
                  {progress.status === 'idle' ? 'Lancer l\'Analyse IA' : progress.currentStep}
                </Button>
                
                {progress.status !== 'idle' && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {progress.estimatedTimeRemaining > 0 && `~${progress.estimatedTimeRemaining}s`}
                  </div>
                )}
              </div>

              {(progress.status === 'searching' || progress.status === 'analyzing') && (
                <div className="space-y-2">
                  <Progress value={progress.progress} className="w-full" />
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Bot className="h-4 w-4 animate-pulse" />
                    Agent IA en cours d'analyse du marché...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysis && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="competitors">Concurrents</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">Position Prix</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPricePositionIcon(analysis.marketInsights.pricePosition)}
                        <span className="text-sm">
                          {analysis.marketInsights.pricePosition === 'above' && 'Au-dessus du marché'}
                          {analysis.marketInsights.pricePosition === 'below' && 'En-dessous du marché'}
                          {analysis.marketInsights.pricePosition === 'at' && 'Dans la moyenne'}
                        </span>
                      </div>
                      <div className="text-lg font-bold mt-2">
                        {formatCurrency(analysis.ourOffer.price)} vs {formatCurrency(analysis.marketInsights.averagePrice)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">Concurrents</span>
                      </div>
                      <div className="text-2xl font-bold">{analysis.competitors.length}</div>
                      <div className="text-sm text-gray-600">identifiés</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold">Avantages Uniques</span>
                      </div>
                      <div className="text-2xl font-bold">{analysis.marketInsights.uniqueFeatures.length}</div>
                      <div className="text-sm text-gray-600">fonctionnalités</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Aperçu du Marché
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Fonctionnalités Communes</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.marketInsights.commonFeatures.map((feature, index) => (
                            <Badge key={index} variant="secondary">{feature}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Vos Avantages Uniques</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.marketInsights.uniqueFeatures.map((feature, index) => (
                            <Badge key={index} className="bg-green-100 text-green-800">{feature}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="competitors" className="space-y-4">
                <div className="grid gap-4">
                  {analysis.competitors.map((competitor) => (
                    <Card key={competitor.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{competitor.company}</h3>
                            <p className="text-gray-600">{competitor.productName}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatCurrency(competitor.price)}
                            </div>
                            <Badge 
                              className={
                                competitor.marketPosition === 'premium' ? 'bg-purple-100 text-purple-800' :
                                competitor.marketPosition === 'mid' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }
                            >
                              {competitor.marketPosition === 'premium' ? 'Premium' : 
                               competitor.marketPosition === 'mid' ? 'Milieu' : 'Budget'}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2">Forces</h4>
                            <ul className="text-sm space-y-1">
                              {competitor.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-700 mb-2">Faiblesses</h4>
                            <ul className="text-sm space-y-1">
                              {competitor.weaknesses.map((weakness, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <AlertTriangle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Fonctionnalités</h4>
                            <div className="flex flex-wrap gap-1">
                              {competitor.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">{feature}</Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-semibold">{competitor.trustScore}/100</span>
                              <a 
                                href={competitor.sourceUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-auto text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tendances du Marché</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.marketInsights.marketTrends.map((trend, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                            <span className="text-sm">{trend}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Analyse des Prix</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Prix moyen marché:</span>
                        <span className="font-bold">{formatCurrency(analysis.marketInsights.averagePrice)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Votre prix:</span>
                        <span className="font-bold text-blue-600">{formatCurrency(analysis.ourOffer.price)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Écart:</span>
                        <span className={`font-bold ${
                          analysis.marketInsights.pricePosition === 'above' ? 'text-red-600' :
                          analysis.marketInsights.pricePosition === 'below' ? 'text-green-600' :
                          'text-blue-600'
                        }`}>
                          {analysis.marketInsights.pricePosition === 'above' ? '+' : 
                           analysis.marketInsights.pricePosition === 'below' ? '-' : '±'}
                          {formatCurrency(analysis.marketInsights.priceGap)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        Recommandations Tarifaires
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{analysis.recommendations.pricing}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        Positionnement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{analysis.recommendations.positioning}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-600" />
                        Fonctionnalités
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{analysis.recommendations.features}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-orange-600" />
                        Veille Concurrentielle
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{analysis.recommendations.competitive}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
