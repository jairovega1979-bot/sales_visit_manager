
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarDays, 
  Users, 
  BarChart3, 
  MapPin, 
  Phone, 
  Target, 
  CheckCircle,
  TrendingUp,
  Clock,
  Building
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: CalendarDays,
      title: "Gestion d'Agenda",
      description: "Planifiez et organisez vos visites commerciales avec un calendrier intelligent et des rappels automatiques."
    },
    {
      icon: Users,
      title: "Gestion de Clients",
      description: "Base de données complète de vos clients avec historique des interactions et préférences."
    },
    {
      icon: BarChart3,
      title: "Analyses & Rapports",
      description: "Tableaux de bord en temps réel avec métriques de performance et analyses de ventes."
    },
    {
      icon: MapPin,
      title: "Optimisation d'Itinéraires",
      description: "Planification intelligente des trajets pour maximiser l'efficacité de vos visites."
    },
    {
      icon: Phone,
      title: "Gestion d'Appels",
      description: "Suivi des appels téléphoniques avec priorités et rappels automatiques."
    },
    {
      icon: Target,
      title: "Objectifs de Vente",
      description: "Définition et suivi des objectifs commerciaux avec indicateurs de progression."
    },
    {
      icon: CheckCircle,
      title: "Système de Tâches",
      description: "Organisation des tâches commerciales avec statuts et deadlines."
    },
    {
      icon: TrendingUp,
      title: "Prédictions",
      description: "Analyses prédictives pour optimiser vos stratégies commerciales."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bienvenue sur birdlogyc
          </h1>
          <p className="text-2xl text-gray-600 mb-6">
            La plateforme professionnelle de gestion des visites commerciales
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-3xl mx-auto">
            Optimisez vos performances commerciales avec notre solution complète de gestion des visites, 
            spécialement conçue pour les entreprises suisses.
          </p>
          
          <div className="space-y-4">
            <Link href="/auth/signin">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Accéder à la Démonstration
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              Comptes de démonstration disponibles : Pierre Martin (Manager), Marie Dubois (Commercial), Sarah Johnson (Manager)
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Fonctionnalités Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi Choisir birdlogyc ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Augmentez vos Ventes</h3>
              <p className="text-gray-600">
                Optimisez votre processus commercial et augmentez vos taux de conversion grâce à nos outils avancés.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gagnez du Temps</h3>
              <p className="text-gray-600">
                Automatisez vos tâches répétitives et concentrez-vous sur ce qui compte : vos clients.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Building className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Conçu pour la Suisse</h3>
              <p className="text-gray-600">
                Solution adaptée aux spécificités du marché suisse et aux exigences locales.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Transformer votre Approche Commerciale ?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Découvrez toutes les fonctionnalités en mode démonstration
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Commencer la Démonstration
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
