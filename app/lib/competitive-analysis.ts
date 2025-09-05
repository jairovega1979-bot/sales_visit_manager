
// Competitive Analysis Service with AI Agent
export interface CompetitiveOffer {
  id: string;
  company: string;
  productName: string;
  price: number;
  currency: string;
  features: string[];
  strengths: string[];
  weaknesses: string[];
  marketPosition: 'premium' | 'mid' | 'budget';
  trustScore: number; // 0-100
  sourceUrl: string;
  lastUpdated: Date;
}

export interface CompetitiveAnalysis {
  searchQuery: string;
  ourOffer: {
    name: string;
    price: number;
    features: string[];
    description: string;
  };
  competitors: CompetitiveOffer[];
  marketInsights: {
    averagePrice: number;
    pricePosition: 'above' | 'at' | 'below';
    priceGap: number;
    commonFeatures: string[];
    uniqueFeatures: string[];
    marketTrends: string[];
  };
  recommendations: {
    pricing: string;
    positioning: string;
    features: string;
    competitive: string;
  };
  analysisTimestamp: Date;
}

// Simulated AI Web Scraping Agent
export class CompetitiveIntelligenceAgent {
  private static simulatedDelay = 3000; // 3 seconds to simulate real web scraping

  static async searchCompetitors(
    searchQuery: string,
    ourOffer: { name: string; price: number; features: string[]; description: string }
  ): Promise<CompetitiveAnalysis> {
    // Simulate AI agent searching the web
    await new Promise(resolve => setTimeout(resolve, this.simulatedDelay));

    // Mock competitive data based on search query
    const competitors = this.generateMockCompetitors(searchQuery);
    const marketInsights = this.analyzeMarket(ourOffer, competitors);
    const recommendations = this.generateRecommendations(ourOffer, competitors, marketInsights);

    return {
      searchQuery,
      ourOffer,
      competitors,
      marketInsights,
      recommendations,
      analysisTimestamp: new Date()
    };
  }

  private static generateMockCompetitors(searchQuery: string): CompetitiveOffer[] {
    const baseCompetitors = [
      {
        company: "Salesforce",
        productName: "Sales Cloud Enterprise",
        basePrice: 150000,
        features: ["CRM complet", "Automation", "Analytics", "Mobile", "API intégrations"],
        strengths: ["Leader du marché", "Écosystème riche", "Scalabilité"],
        weaknesses: ["Prix élevé", "Complexité", "Courbe d'apprentissage"],
        marketPosition: "premium" as const,
        trustScore: 92
      },
      {
        company: "HubSpot",
        productName: "Sales Hub Professional",
        basePrice: 45000,
        features: ["CRM gratuit", "Sequences", "Reporting", "Intégrations"],
        strengths: ["Interface intuitive", "Onboarding facile", "Support client"],
        weaknesses: ["Fonctionnalités limitées", "Personnalisation réduite"],
        marketPosition: "mid" as const,
        trustScore: 87
      },
      {
        company: "Pipedrive",
        productName: "Advanced Plan",
        basePrice: 25000,
        features: ["Pipeline visuel", "Automatisation", "Rapports", "Mobile"],
        strengths: ["Simplicité", "Prix abordable", "Focus ventes"],
        weaknesses: ["Fonctionnalités marketing limitées", "Moins de intégrations"],
        marketPosition: "mid" as const,
        trustScore: 84
      },
      {
        company: "Zoho",
        productName: "CRM Plus",
        basePrice: 18000,
        features: ["CRM complet", "Social media", "Email marketing", "Analytics"],
        strengths: ["Prix attractif", "Suite complète", "Personnalisation"],
        weaknesses: ["Interface datée", "Support parfois lent"],
        marketPosition: "budget" as const,
        trustScore: 78
      },
      {
        company: "Microsoft",
        productName: "Dynamics 365 Sales",
        basePrice: 85000,
        features: ["Integration Office", "AI insights", "Mobile", "Personnalisation"],
        strengths: ["Intégration Microsoft", "IA avancée", "Enterprise ready"],
        weaknesses: ["Complexité", "Coût des licences", "Courbe d'apprentissage"],
        marketPosition: "premium" as const,
        trustScore: 89
      }
    ];

    // Add some randomization based on search query
    return baseCompetitors.map((competitor, index) => ({
      id: `competitor-${index}`,
      ...competitor,
      price: competitor.basePrice + Math.random() * 20000 - 10000,
      currency: "CHF",
      sourceUrl: `https://${competitor.company.toLowerCase()}.com/sales-solution`,
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
    }));
  }

  private static analyzeMarket(
    ourOffer: { name: string; price: number; features: string[] },
    competitors: CompetitiveOffer[]
  ) {
    const competitorPrices = competitors.map(c => c.price);
    const averagePrice = competitorPrices.reduce((sum, price) => sum + price, 0) / competitorPrices.length;
    
    const pricePosition: 'above' | 'at' | 'below' = 
      ourOffer.price > averagePrice * 1.1 ? 'above' : 
      ourOffer.price < averagePrice * 0.9 ? 'below' : 'at';
    
    const priceGap = Math.abs(ourOffer.price - averagePrice);
    
    // Analyze features
    const allCompetitorFeatures = competitors.flatMap(c => c.features);
    const featureCounts = allCompetitorFeatures.reduce((acc, feature) => {
      acc[feature] = (acc[feature] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const commonFeatures = Object.entries(featureCounts)
      .filter(([_, count]) => count >= competitors.length * 0.6)
      .map(([feature]) => feature);
    
    const uniqueFeatures = ourOffer.features.filter(feature => 
      !allCompetitorFeatures.includes(feature)
    );

    const marketTrends = [
      "Intégration IA en forte croissance",
      "Demande croissante pour mobile-first",
      "Automatisation des processus prioritaire",
      "Analytics prédictives en développement",
      "Focus sur l'expérience utilisateur"
    ];

    return {
      averagePrice: Math.round(averagePrice),
      pricePosition,
      priceGap: Math.round(priceGap),
      commonFeatures,
      uniqueFeatures,
      marketTrends
    };
  }

  private static generateRecommendations(
    ourOffer: any,
    competitors: CompetitiveOffer[],
    marketInsights: any
  ) {
    const premiumCompetitors = competitors.filter(c => c.marketPosition === 'premium');
    const avgTrustScore = competitors.reduce((sum, c) => sum + c.trustScore, 0) / competitors.length;

    return {
      pricing: marketInsights.pricePosition === 'above' 
        ? `Votre prix est ${Math.round(marketInsights.priceGap)} CHF au-dessus de la moyenne. Considérez une justification valeur ou un repositionnement.`
        : marketInsights.pricePosition === 'below'
        ? `Opportunité de hausse de prix de ${Math.round(marketInsights.priceGap)} CHF en mettant en avant vos avantages uniques.`
        : `Prix compétitif par rapport au marché. Maintenez cette position tout en renforçant la valeur perçue.`,
      
      positioning: `${premiumCompetitors.length} concurrents premium identifiés. ${
        avgTrustScore > 85 
          ? "Marché mature avec concurrents établis - différenciation crucial." 
          : "Opportunité de gagner parts de marché grâce à l'innovation."
      }`,
      
      features: marketInsights.uniqueFeatures.length > 0
        ? `Excellent: ${marketInsights.uniqueFeatures.length} fonctionnalités différenciantes identifiées. Mettez-les en avant!`
        : `Considérez l'ajout de fonctionnalités innovantes pour vous démarquer de ${competitors.length} concurrents.`,
      
      competitive: `Surveillez particulièrement ${competitors
        .filter(c => Math.abs(c.price - ourOffer.price) < ourOffer.price * 0.2)
        .map(c => c.company)
        .slice(0, 2)
        .join(" et ")} qui ont des prix similaires.`
    };
  }

  // Search suggestions based on offer type
  static generateSearchSuggestions(offerName: string): string[] {
    const baseTerms = offerName.toLowerCase().split(' ');
    
    const suggestions = [
      `${offerName} prix concurrence`,
      `alternatives ${offerName}`,
      `comparaison ${offerName} solutions`,
      `${baseTerms[0]} enterprise solutions pricing`,
      `best ${baseTerms.join(' ')} competitors`,
      `${offerName} market analysis 2024`
    ];

    return suggestions.filter(s => s.length > 10).slice(0, 4);
  }
}

// Status tracking for competitive analysis
export type AnalysisStatus = 'idle' | 'searching' | 'analyzing' | 'completed' | 'error';

export interface AnalysisProgress {
  status: AnalysisStatus;
  progress: number; // 0-100
  currentStep: string;
  estimatedTimeRemaining: number; // seconds
}
