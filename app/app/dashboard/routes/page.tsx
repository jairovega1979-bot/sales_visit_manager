
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Route, Clock, Car, Zap, Calendar } from 'lucide-react';

const mockRoutes = [
  {
    id: '1',
    name: 'Route Genève - Lundi',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    totalDistance: '87 km',
    estimatedTime: '3h 45min',
    numberOfStops: 4,
    status: 'OPTIMIZED',
    stops: [
      { customer: 'UBS Genève', address: 'Place des Bergues 3, Genève', arrivalTime: '09:00', duration: '90min' },
      { customer: 'Credit Suisse', address: 'Rue du Rhône 8, Genève', arrivalTime: '11:15', duration: '60min' },
      { customer: 'Banque Pictet', address: 'Route des Acacias 60, Genève', arrivalTime: '13:30', duration: '75min' },
      { customer: 'Lombard Odier', address: 'Rue de la Corraterie 11, Genève', arrivalTime: '15:45', duration: '45min' }
    ]
  },
  {
    id: '2',
    name: 'Route Zurich - Mardi',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    totalDistance: '45 km',
    estimatedTime: '2h 30min',
    numberOfStops: 3,
    status: 'PLANNED',
    stops: [
      { customer: 'Swiss Re', address: 'Mythenquai 50, Zurich', arrivalTime: '10:00', duration: '120min' },
      { customer: 'Zurich Insurance', address: 'Hagenholzstrasse 60, Zurich', arrivalTime: '13:15', duration: '90min' },
      { customer: 'ABB Suisse', address: 'Affolternstrasse 44, Zurich', arrivalTime: '15:30', duration: '60min' }
    ]
  },
  {
    id: '3',
    name: 'Route Bâle - Mercredi',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    totalDistance: '23 km',
    estimatedTime: '2h 15min',
    numberOfStops: 2,
    status: 'DRAFT',
    stops: [
      { customer: 'Roche Pharmaceuticals', address: 'Grenzacherstrasse 124, Bâle', arrivalTime: '09:30', duration: '150min' },
      { customer: 'Novartis', address: 'Lichtstrasse 35, Bâle', arrivalTime: '13:45', duration: '90min' }
    ]
  }
];

export default function RoutesPage() {
  const [routes] = useState(mockRoutes);
  const [selectedDate, setSelectedDate] = useState('all');

  const filteredRoutes = selectedDate === 'all' 
    ? routes 
    : routes.filter(route => {
        const routeDate = new Date(route.date).toDateString();
        const filterDate = new Date(selectedDate).toDateString();
        return routeDate === filterDate;
      });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPTIMIZED': return 'bg-green-50 text-green-800 border border-green-200';
      case 'PLANNED': return 'bg-brand-sky/50 text-brand-navy border border-brand-blue/30';
      case 'DRAFT': return 'bg-gray-50 text-gray-800 border border-gray-200';
      case 'IN_PROGRESS': return 'bg-yellow-50 text-yellow-800 border border-yellow-200';
      default: return 'bg-brand-sky/30 text-brand-navy border border-brand-sky/50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPTIMIZED': return 'Optimisé';
      case 'PLANNED': return 'Planifié';
      case 'DRAFT': return 'Brouillon';
      case 'IN_PROGRESS': return 'En cours';
      default: return status;
    }
  };

  const totalKm = routes.reduce((sum, route) => sum + parseInt(route.totalDistance.replace(' km', '')), 0);
  const optimizedRoutes = routes.filter(r => r.status === 'OPTIMIZED').length;
  const totalStops = routes.reduce((sum, route) => sum + route.numberOfStops, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-brand-sky/30">
        <div>
          <h1 className="text-4xl font-bold text-brand-navy bg-gradient-to-r from-brand-navy to-brand-blue bg-clip-text text-transparent">
            Optimisation des Itinéraires
          </h1>
          <p className="text-brand-navy/70 mt-2 text-lg">Planifiez vos tournées commerciales efficacement</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:border-brand-navy hover:scale-105 transition-all duration-200">
            <Zap className="h-4 w-4 mr-2" />
            Auto-optimiser
          </Button>
          <Button className="bg-brand-navy hover:bg-brand-blue text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <Route className="h-4 w-4 mr-2" />
            Nouvelle Route
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-brand-navy">{routes.length}</div>
                <div className="text-sm text-brand-navy/70 font-medium">Routes Planifiées</div>
              </div>
              <Route className="h-8 w-8 text-brand-navy" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hexagon-decoration">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{optimizedRoutes}</div>
                <div className="text-sm text-brand-navy/70 font-medium">Routes Optimisées</div>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-brand-light-blue">{totalStops}</div>
                <div className="text-sm text-brand-navy/70 font-medium">Arrêts Total</div>
              </div>
              <MapPin className="h-8 w-8 text-brand-light-blue" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-brand-blue">{totalKm} km</div>
                <div className="text-sm text-brand-navy/70 font-medium">Distance Totale</div>
              </div>
              <Car className="h-8 w-8 text-brand-blue" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-64 h-12 border-brand-sky bg-white/80 backdrop-blur-sm shadow-md focus:ring-brand-blue focus:border-brand-blue">
            <SelectValue placeholder="Filtrer par date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les dates</SelectItem>
            <SelectItem value={new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()}>Lundi</SelectItem>
            <SelectItem value={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()}>Mardi</SelectItem>
            <SelectItem value={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()}>Mercredi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Routes List */}
      <div className="space-y-6">
        {filteredRoutes.map((route) => (
          <Card key={route.id} className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 bg-logo-watermark">
            <CardHeader className="bg-brand-gradient-soft rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-brand-navy font-bold">{route.name}</CardTitle>
                  <div className="flex items-center text-sm text-brand-navy/70 mt-2 font-medium">
                    <Calendar className="h-4 w-4 mr-1 text-brand-blue" />
                    {route.date.toLocaleDateString('fr-CH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <Badge className={getStatusColor(route.status)}>
                  {getStatusLabel(route.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 relative z-10">
              <div className="space-y-6">
                {/* Route Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-brand-sky/20 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Car className="h-5 w-5 text-brand-blue" />
                    <div>
                      <div className="font-bold text-brand-navy">{route.totalDistance}</div>
                      <div className="text-sm text-brand-navy/70">Distance totale</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-bold text-brand-navy">{route.estimatedTime}</div>
                      <div className="text-sm text-brand-navy/70">Temps estimé</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-brand-light-blue" />
                    <div>
                      <div className="font-bold text-brand-navy">{route.numberOfStops} arrêts</div>
                      <div className="text-sm text-brand-navy/70">Visites prévues</div>
                    </div>
                  </div>
                </div>

                {/* Stops List */}
                <div className="space-y-4">
                  <h4 className="font-bold text-brand-navy text-lg">Itinéraire détaillé:</h4>
                  {route.stops.map((stop, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-white/60 border border-brand-sky/30 rounded-xl hover:bg-white/80 transition-all duration-200">
                      <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-brand-navy">{stop.customer}</div>
                        <div className="text-sm text-brand-navy/70">{stop.address}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-brand-blue bg-brand-sky/30 px-2 py-1 rounded-lg">{stop.arrivalTime}</div>
                        <div className="text-sm text-brand-navy/70 mt-1">{stop.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap space-x-3 pt-4 border-t border-brand-sky/30">
                  {route.status === 'DRAFT' && (
                    <>
                      <Button className="bg-brand-navy hover:bg-brand-blue hover:scale-105 transition-all duration-200">
                        <Zap className="h-4 w-4 mr-2" />
                        Optimiser
                      </Button>
                      <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:scale-105 transition-all duration-200">Modifier</Button>
                    </>
                  )}
                  {route.status === 'PLANNED' && (
                    <>
                      <Button className="bg-brand-navy hover:bg-brand-blue hover:scale-105 transition-all duration-200">
                        <Route className="h-4 w-4 mr-2" />
                        Démarrer navigation
                      </Button>
                      <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:scale-105 transition-all duration-200">
                        <Zap className="h-4 w-4 mr-2" />
                        Re-optimiser
                      </Button>
                    </>
                  )}
                  {route.status === 'OPTIMIZED' && (
                    <>
                      <Button className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200">
                        <Route className="h-4 w-4 mr-2" />
                        Navigation GPS
                      </Button>
                      <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:scale-105 transition-all duration-200">Exporter</Button>
                      <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:scale-105 transition-all duration-200">Partager</Button>
                    </>
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
