
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Calendar, 
  MapPin, 
  BarChart3,
  Clock,
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-gradient-soft">
      {/* Header - Mobile Optimized */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-white shadow-md flex-shrink-0">
                <Image
                  src="/birdlogyc-logo.png"
                  alt="birdlogyc logo"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-navy truncate">birdlogyc</h1>
            </div>
            <nav className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
              <div className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-brand-blue hover:text-brand-navy transition-colors font-medium">Fonctionnalités</a>
                <a href="#benefits" className="text-brand-blue hover:text-brand-navy transition-colors font-medium">Avantages</a>
              </div>
              <Link href="/dashboard">
                <Button className="bg-brand-navy hover:bg-brand-blue text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
                  <span className="hidden sm:inline">Accéder au Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-logo-large relative overflow-hidden">
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy mb-4 sm:mb-6 break-words">
              Bienvenue sur <span className="text-brand-blue bg-gradient-to-r from-brand-blue to-brand-light-blue bg-clip-text text-transparent">birdlogyc</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-brand-navy/80 mb-6 sm:mb-8 leading-relaxed px-2">
              Plateforme avancée de gestion commerciale avec <strong>algorithme de priorisation intelligent</strong> - 
              Augmentez vos rendez-vous et vos ventes grâce à l'IA qui identifie automatiquement vos prospects les plus prometteurs. 
              Solution complète avec fonctionnalités de management pour optimiser les performances de toute votre équipe commerciale.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-brand-navy hover:bg-brand-blue text-white text-base sm:text-lg px-6 sm:px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
                  <span className="sm:hidden">Dashboard Demo</span>
                  <span className="hidden sm:inline">Accéder au Dashboard Demo</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 border-brand-blue text-brand-blue hover:bg-brand-sky hover:border-brand-navy transition-all duration-200">
                  <span className="sm:hidden">En savoir plus</span>
                  <span className="hidden sm:inline">En savoir plus</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
        {/* Hexagonal decorations */}
        <div className="absolute top-20 left-10 w-16 h-14 bg-brand-sky/30 clip-path-hexagon animate-brand-pulse"></div>
        <div className="absolute bottom-20 right-10 w-12 h-10 bg-brand-light-blue/20 clip-path-hexagon animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-7 bg-brand-blue/10 clip-path-hexagon animate-brand-pulse" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 px-4 bg-brand-sky/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-brand-navy mb-4">Fonctionnalités Clés</h3>
            <p className="text-lg text-brand-navy/80">Les outils essentiels pour maximiser vos performances commerciales</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg border border-red-200/60 hover:shadow-xl transition-all duration-200 hover:scale-105">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600 mb-3">J'attendais votre appel</div>
              <div className="text-brand-navy/80 font-medium text-sm leading-relaxed">
                Algorithme IA qui analyse l'historique, la géolocalisation et les comportements d'achat pour identifier automatiquement les 20 prospects les plus prometteurs chaque jour
              </div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg border border-green-200/60 hover:shadow-xl transition-all duration-200 hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-3">Ventes & Objectifs</div>
              <div className="text-brand-navy/80 font-medium text-sm leading-relaxed">
                Suivi personnalisé des performances commerciales avec métriques en temps réel, prévisions intelligentes et recommandations d'actions pour atteindre vos objectifs
              </div>
            </div>
            <div className="text-center bg-white/70 backdrop-blur rounded-2xl p-8 shadow-lg border border-blue-200/60 hover:shadow-xl transition-all duration-200 hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-3">Management d'Équipe</div>
              <div className="text-brand-navy/80 font-medium text-sm leading-relaxed">
                Console complète pour managers : fixation d'objectifs, analytics d'équipe, rankings de performance, rapports détaillés et outils de pilotage commercial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-logo-watermark">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-brand-navy mb-4">
              Plateforme Commerciale Intelligente
            </h3>
            <p className="text-xl text-brand-navy/80 max-w-3xl mx-auto">
              Solution complète avec algorithmes avancés pour maximiser vos rendez-vous, optimiser vos ventes et gérer efficacement votre équipe commerciale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-white/80 backdrop-blur-sm border border-red-200/50 hexagon-decoration">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-red-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-brand-navy">Algorithme "J'attendais votre appel"</h4>
                <p className="text-brand-navy/70">
                  IA avancée qui analyse historique d'achats, géolocalisation et comportements pour identifier automatiquement vos 20 meilleurs prospects quotidiens
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-white/80 backdrop-blur-sm border border-green-200/50">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="h-7 w-7 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-brand-navy">Module Ventes & Objectifs</h4>
                <p className="text-brand-navy/70">
                  Suivi personnalisé avec KPI en temps réel, prévisions basées sur l'IA et recommandations automatiques d'actions pour maximiser vos performances
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-white/80 backdrop-blur-sm border border-blue-200/50">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-brand-navy">Console Management</h4>
                <p className="text-brand-navy/70">
                  Tableau de bord avancé pour managers : fixation d'objectifs, analytics d'équipe, rankings de performance et pilotage commercial complet
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-white/80 backdrop-blur-sm border border-brand-sky/30">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-brand-blue/40 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="h-7 w-7 text-brand-navy" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-brand-navy">Optimisation Géographique</h4>
                <p className="text-brand-navy/70">
                  Algorithmes de routage intelligent pour optimiser vos déplacements commerciaux avec calcul automatique des itinéraires les plus efficaces
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-white/80 backdrop-blur-sm border border-brand-sky/30">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-brand-sky/40 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="h-7 w-7 text-brand-navy" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-brand-navy">Planification Intelligente</h4>
                <p className="text-brand-navy/70">
                  Agenda avancé avec synchronisation automatique, rappels intelligents et optimisation des créneaux selon la proximité géographique
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-white/80 backdrop-blur-sm border border-brand-sky/30">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-brand-blue/40 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="h-7 w-7 text-brand-navy" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-brand-navy">CRM Intégré</h4>
                <p className="text-brand-navy/70">
                  Gestion complète des clients, offres et appels avec historique détaillé, notes de visite et suivi automatique des opportunités
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-brand-gradient">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-brand-navy mb-6">
                Pourquoi birdlogyc?
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <CheckCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-brand-navy">Algorithme de Priorisation Avancé</h4>
                    <p className="text-brand-navy/80">IA qui analyse historique d'achats, géolocalisation et cycles de vente pour identifier automatiquement vos prospects les plus chauds et augmenter vos taux de conversion</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-brand-navy">Outils Management Complets</h4>
                    <p className="text-brand-navy/80">Console dédiée pour managers avec fixation d'objectifs, analytics d'équipe, rankings de performance et rapports de pilotage commercial</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-brand-navy">Optimisation Géographique Suisse</h4>
                    <p className="text-brand-navy/80">Algorithmes spécialement adaptés au territoire suisse : géographie alpine, heures d'ouverture locales et optimisation des trajets intercantonnaux</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <CheckCircle className="h-6 w-6 text-brand-blue mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-brand-navy">Résultats Mesurables Immédiats</h4>
                    <p className="text-brand-navy/80">Métriques en temps réel, prévisions intelligentes et recommandations d'actions pour maximiser vos performances commerciales dès le premier jour</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-brand-sky/50 bg-logo-corner">
                <div className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-brand-sky/30 p-4">
                  <Image
                    src="/birdlogyc-logo.png"
                    alt="birdlogyc logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h4 className="text-2xl font-bold text-brand-navy mb-4">
                  Qualité Suisse
                </h4>
                <p className="text-brand-navy/80 mb-6">
                  Développé en Suisse, pour les entreprises suisses. Les plus hauts standards de sécurité et de confidentialité des données.
                </p>
                <div className="bg-brand-sky/30 p-4 rounded-lg border border-brand-blue/20">
                  <p className="text-sm text-brand-navy font-medium">
                    Conforme RGPD • Serveurs en Suisse • Chiffrement SSL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-brand-gradient-dark relative overflow-hidden">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h3 className="text-4xl font-bold text-white mb-6">
            Prêt à multiplier vos rendez-vous et vos ventes?
          </h3>
          <p className="text-xl text-brand-sky mb-8">
            Découvrez notre algorithme intelligent et nos outils de management dans la démo complète
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-brand-navy hover:bg-brand-sky hover:text-brand-navy text-lg px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              Accéder au Dashboard Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-brand-sky/80 text-sm mt-4">
            Demo complète disponible • Toutes les fonctionnalités
          </p>
        </div>
        {/* Logo Background for CTA */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
          <Image
            src="/birdlogyc-logo.png"
            alt="birdlogyc background"
            fill
            className="object-contain"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-brand-gradient py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="relative w-8 h-8 rounded-lg bg-white p-1">
                <Image
                  src="/birdlogyc-logo.png"
                  alt="birdlogyc logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-brand-navy">birdlogyc</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-brand-navy/80 text-sm">
                © 2025 birdlogyc. Développé pour les entreprises suisses.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
