
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PriorityCallsModule } from '@/components/priority-calls/priority-calls-module';
import { 
  Phone, 
  ArrowLeft, 
  Calendar, 
  Target,
  TrendingUp,
  Users,
  Clock,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function PriorityCallsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-brand-navy">J'attendais votre appel</h1>
            <p className="text-brand-navy/70 mt-1">
              Module de recommandations d'appels par intelligence artificielle
            </p>
          </div>
        </div>
      </div>

      {/* Algorithm Description */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="h-5 w-5" />
            Algorithme de Priorisation des Appels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700">
            Ce module utilise un algorithme avancé pour recommander quotidiennement les 20 appels les plus pertinents. 
            <strong>Nouveauté:</strong> Les clients non contactés persistent pendant 5 jours avec des alertes manager configurables.
            Filtrage automatique des clients contactés dans les 30 derniers jours.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold">Clients TOP 100</span>
                  <p className="text-blue-600">Clients prioritaires de l'année précédente sans achat cette année</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold">Temps depuis dernière visite</span>
                  <p className="text-blue-600">Plus le temps écoulé est long, plus la priorité augmente</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold">Temps depuis dernier appel</span>
                  <p className="text-blue-600">Priorise les clients non contactés récemment</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold">Convenance avec les itinéraires</span>
                  <p className="text-blue-600">Priorise les clients sur l'itinéraire des 10 prochains jours</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold">Periodicité d'achat</span>
                  <p className="text-blue-600">Identifie le moment optimal selon les habitudes d'achat</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold">Persistance client (NOUVEAU)</span>
                  <p className="text-blue-600">Clients non contactés maintenus 5 jours avec urgence escaladée</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold">Filtrage 30 jours (NOUVEAU)</span>
                  <p className="text-blue-600">Exclusion automatique des clients récemment contactés</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objectives */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800">Dynamiser la Clientèle</h3>
            <p className="text-sm text-green-600 mt-1">
              Assurer la couverture complète de la base clients
            </p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-800">Contact Régulier</h3>
            <p className="text-sm text-blue-600 mt-1">
              Maintenir une fréquence appropriée avec chaque client
            </p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-800">RDV de Qualité</h3>
            <p className="text-sm text-purple-600 mt-1">
              Générer plus de rendez-vous commerciaux efficaces
            </p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <h3 className="font-semibold text-indigo-800">Volume de Ventes</h3>
            <p className="text-sm text-indigo-600 mt-1">
              Augmenter le chiffre d'affaires global
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Module */}
      <PriorityCallsModule isExpanded={true} />

      {/* Footer Info */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm">
              <strong>Note:</strong> Cette liste est mise à jour quotidiennement et se base sur les données 
              des visites, appels et achats enregistrés dans le système. Pour obtenir des recommandations 
              optimales, assurez-vous de maintenir vos données à jour.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
