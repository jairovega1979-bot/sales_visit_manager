
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardStats } from '@/lib/types';
import { PriorityCallsModule } from '@/components/priority-calls/priority-calls-module';
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Phone,
  Calendar,
  MapPin,
  ArrowRight,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Euro
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/lib/utils';
import { WidgetErrorBoundary } from '@/components/error-boundary';
import { SmoothTransition } from '@/components/ui/loading-wrapper';

// Helper function to get company logo
function getCompanyLogo(companyName: string): string {
  const logoMap: { [key: string]: string } = {
    'Nestlé Suisse SA': '/companies/nestle-logo.png',
    'UBS Genève': '/companies/ubs-logo.png',
    'Roche Pharmaceuticals': '/companies/roche-logo.png',
    'Rolex SA': '/companies/rolex-logo.png',
    'Credit Suisse': '/companies/credit-suisse-logo.png'
  };
  
  return logoMap[companyName] || '/birdlogyc-logo.png';
}

interface DashboardContentProps {
  stats: DashboardStats;
  user: {
    role?: string;
    firstName?: string | null;
    name?: string | null;
  };
}

export function DashboardContent({ stats, user }: DashboardContentProps) {
  const isManager = user?.role === 'MANAGER';
  const [priorityCallsExpanded, setPriorityCallsExpanded] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  // Trigger smooth content appearance
  React.useEffect(() => {
    const timer = setTimeout(() => setContentLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const kpiCards = [
    {
      title: 'Total Clients',
      value: stats?.totalCustomers?.toString() || '0',
      icon: Users,
      color: 'text-brand-navy',
      bgColor: 'bg-brand-sky/30',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Clients Actifs',
      value: stats?.activeCustomers?.toString() || '0',
      icon: CheckCircle,
      color: 'text-brand-navy',
      bgColor: 'bg-brand-light-blue/30',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Valeur Offres',
      value: formatCurrency(stats?.totalOffersValue || 0),
      icon: Euro,
      color: 'text-brand-navy',
      bgColor: 'bg-brand-blue/30',
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      title: 'Taux de Succès',
      value: `${stats?.winRate || 0}%`,
      icon: Target,
      color: 'text-brand-navy',
      bgColor: 'bg-brand-sky/40',
      change: '+3%',
      changeType: 'positive' as const
    }
  ];

  return (
    <SmoothTransition show={contentLoaded}>
      <div className="space-y-6 animate-in fade-in duration-700">
      {/* Welcome Section - Mobile Optimized */}
      <div className="bg-gradient-to-br from-brand-navy via-brand-blue to-brand-light-blue rounded-2xl sm:rounded-3xl text-white p-4 sm:p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 backdrop-blur-sm overflow-hidden">
              <Image 
                src="/birdlogyc-logo.png" 
                alt="birdlogyc logo" 
                width={28} 
                height={28} 
                className="sm:w-8 sm:h-8"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 break-words">
                Bonjour, {user?.firstName || user?.name}!
              </h2>
              <p className="text-white/80 text-xs sm:text-sm break-words">
                Tableau de bord commercial
              </p>
              <p className="text-white/70 text-xs mt-1 hidden sm:block">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20">
            <p className="text-white text-sm sm:text-base md:text-lg mb-3 sm:mb-4 font-medium break-words">
              📋 Résumé du jour: <span className="text-brand-sky font-bold">{stats?.pendingCalls || 0}</span> appels programmés
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link href="/dashboard/calls" className="flex-1 sm:flex-none">
                <Button 
                  size="default"
                  className="w-full sm:w-auto bg-white text-brand-navy hover:bg-brand-sky hover:text-brand-navy hover:scale-105 transition-all duration-300 shadow-lg font-semibold"
                >
                  <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Planifier appels</span>
                </Button>
              </Link>
              <Link href="/dashboard/visits" className="flex-1 sm:flex-none">
                <Button 
                  size="default"
                  className="w-full sm:w-auto bg-brand-sky/20 text-white border-2 border-white/40 hover:bg-white hover:text-brand-navy hover:scale-105 transition-all duration-300 shadow-lg backdrop-blur-sm font-semibold"
                >
                  <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Visites cette semaine:</span>
                  <span className="sm:hidden">Visites:</span>
                  <span className="ml-2 bg-white/30 px-2 py-1 rounded-full text-xs sm:text-sm font-bold">
                    {stats?.visitsThisWeek || 0}
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Modern geometric decorations */}
        <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-2xl rotate-12 animate-brand-pulse"></div>
        <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-tr from-brand-sky/30 to-transparent rounded-xl -rotate-12 animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12"></div>
        </div>
      </div>

      {/* Priority Calls Module - J'attendais votre appel */}
      <WidgetErrorBoundary>
        <PriorityCallsModule 
          isExpanded={priorityCallsExpanded}
          onToggle={() => setPriorityCallsExpanded(!priorityCallsExpanded)}
        />
      </WidgetErrorBoundary>

      {/* KPI Cards - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {kpiCards?.map((kpi, index) => (
          <Card 
            key={index} 
            className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hexagon-decoration animate-in slide-in-from-bottom duration-500" 
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-xl ${kpi.bgColor} shadow-md`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-navy/70">{kpi.title}</p>
                    <p className="text-2xl font-bold text-brand-navy">{kpi.value}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  kpi.changeType === 'positive' 
                    ? 'text-brand-blue bg-brand-sky/30' 
                    : 'text-red-600 bg-red-50'
                }`}>
                  {kpi.change}
                </span>
                <span className="text-sm text-brand-navy/60 ml-2">vs. mois dernier</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Customers */}
        <WidgetErrorBoundary>
          <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl hover:shadow-2xl transition-all duration-300 animate-in slide-in-from-left duration-600" style={{ animationDelay: '200ms' }}>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-brand-sky/20 rounded-t-lg p-4 sm:p-6 space-y-2 sm:space-y-0">
              <CardTitle className="text-base sm:text-lg text-brand-navy font-bold">Principaux Clients</CardTitle>
              <Link href="/dashboard/customers">
                <Button variant="outline" size="sm" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:border-brand-navy w-full sm:w-auto">
                  <span className="sm:hidden">Voir tous les clients</span>
                  <span className="hidden sm:inline">Voir tous</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-6">
            <div className="space-y-4">
              {stats?.topCustomers?.length > 0 ? stats.topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-4 bg-brand-sky/20 rounded-xl border border-brand-sky/30 hover:bg-brand-sky/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12 bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0">
                      <Image
                        src={getCompanyLogo(customer.name)}
                        alt={`Logo ${customer.name}`}
                        fill
                        className="object-contain p-2"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-brand-navy">{customer.name}</p>
                        <span className="text-xs font-bold text-brand-blue bg-brand-sky/50 px-2 py-1 rounded-full">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-brand-navy/70">
                        Ventes: {formatCurrency(customer.value)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-brand-blue bg-brand-sky/50 px-2 py-1 rounded-full">
                      +{formatCurrency(customer.growth)}
                    </p>
                    <p className="text-xs text-brand-navy/60 mt-1">Potentiel</p>
                  </div>
                </div>
              )) : (
                <p className="text-brand-navy/60 text-center py-4">Aucune donnée disponible</p>
              )}
            </div>
          </CardContent>
        </Card>
        </WidgetErrorBoundary>

        {/* Offers Needing Attention */}
        <WidgetErrorBoundary>
          <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl hover:shadow-2xl transition-all duration-300 animate-in slide-in-from-right duration-600" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between bg-brand-light-blue/20 rounded-t-lg">
            <CardTitle className="text-lg text-brand-navy font-bold">Offres - Suivi</CardTitle>
            <Link href="/dashboard/offers">
              <Button variant="outline" size="sm" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:border-brand-navy">
                Voir toutes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {stats?.offersNeedingAttention?.length > 0 ? stats.offersNeedingAttention.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 animate-pulse" />
                    <div>
                      <p className="font-semibold text-brand-navy">{offer.offerName}</p>
                      <p className="text-sm text-brand-navy/70">{offer.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={offer.status === 'SENT' ? 'secondary' : 'default'}
                      className={`mb-2 ${offer.status === 'SENT' ? 'bg-brand-sky text-brand-navy' : 'bg-brand-blue text-white'}`}
                    >
                      {offer.status === 'SENT' ? 'Envoyé' : 'Négociation'}
                    </Badge>
                    <p className="text-sm font-semibold text-brand-navy">{formatCurrency(offer.amount)}</p>
                  </div>
                </div>
              )) : (
                <p className="text-brand-navy/60 text-center py-4">Aucune offre en attente</p>
              )}
            </div>
          </CardContent>
        </Card>
        </WidgetErrorBoundary>
      </div>

      {/* Upcoming Visits */}
      <WidgetErrorBoundary>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl hover:shadow-2xl transition-all duration-300 bg-logo-watermark animate-in slide-in-from-bottom duration-700" style={{ animationDelay: '400ms' }}>
        <CardHeader className="flex flex-row items-center justify-between bg-brand-blue/20 rounded-t-lg">
          <CardTitle className="text-lg text-brand-navy font-bold">Prochaines Visites</CardTitle>
          <div className="flex space-x-2">
            <Link href="/dashboard/routes">
              <Button variant="outline" size="sm" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:border-brand-navy">
                <MapPin className="mr-2 h-4 w-4" />
                Planifier itinéraires
              </Button>
            </Link>
            <Link href="/dashboard/visits">
              <Button variant="outline" size="sm" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:border-brand-navy">
                Voir toutes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {stats?.upcomingVisits?.length > 0 ? stats.upcomingVisits.map((visit) => (
              <div key={visit.id} className="p-3 sm:p-4 bg-white/90 backdrop-blur-sm border border-brand-sky/40 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                  <Badge variant="outline" className="bg-brand-sky/40 text-brand-navy border-brand-blue text-xs w-fit">
                    {visit.visitType}
                  </Badge>
                  <span className="text-xs text-brand-navy/70 bg-brand-sky/30 px-2 py-1 rounded-full w-fit">
                    {formatDate(visit.scheduledDate)}
                  </span>
                </div>
                <h4 className="font-semibold text-brand-navy mb-2 text-sm sm:text-base truncate">{visit.customer.customerName}</h4>
                <p className="text-xs sm:text-sm text-brand-navy/80 mb-3 line-clamp-2">{visit.objective}</p>
                <div className="flex flex-col sm:flex-row sm:items-center text-xs text-brand-navy/70 space-y-1 sm:space-y-0">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-brand-blue flex-shrink-0" />
                    <span>{visit.duration ? `${visit.duration} min` : 'Durée TBD'}</span>
                  </div>
                  {visit.location && (
                    <div className="flex items-center sm:ml-3">
                      <MapPin className="h-3 w-3 mr-1 text-brand-blue flex-shrink-0" />
                      <span className="truncate">{visit.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-8 sm:py-12">
                <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-brand-sky mx-auto mb-3 sm:mb-4" />
                <p className="text-brand-navy/60 text-base sm:text-lg mb-3 sm:mb-4">Aucune visite programmée</p>
                <Link href="/dashboard/visits">
                  <Button variant="outline" size="sm" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:border-brand-navy hover:scale-105 transition-all duration-200 w-full sm:w-auto">
                    Programmer une visite
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </WidgetErrorBoundary>

      {/* Quick Actions */}
      <WidgetErrorBoundary>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl hover:shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom duration-800" style={{ animationDelay: '500ms' }}>
        <CardHeader className="bg-brand-gradient rounded-t-lg">
          <CardTitle className="text-lg text-brand-navy font-bold">Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <Link href="/dashboard/customers?action=new">
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 sm:h-14 border-brand-sky text-brand-navy hover:bg-brand-sky hover:border-brand-blue hover:scale-105 transition-all duration-200 shadow-md"
              >
                <Users className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-brand-blue flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">Nouveau Client</span>
              </Button>
            </Link>
            <Link href="/dashboard/offers?action=new">
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 sm:h-14 border-brand-sky text-brand-navy hover:bg-brand-sky hover:border-brand-blue hover:scale-105 transition-all duration-200 shadow-md"
              >
                <FileText className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-brand-blue flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">Nouvelle Offre</span>
              </Button>
            </Link>
            <Link href="/dashboard/calls">
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 sm:h-14 border-brand-sky text-brand-navy hover:bg-brand-sky hover:border-brand-blue hover:scale-105 transition-all duration-200 shadow-md relative"
              >
                <Phone className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-brand-blue flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base truncate">
                  <span className="hidden sm:inline">Liste d'Appels ({stats?.pendingCalls || 0})</span>
                  <span className="sm:hidden">Appels ({stats?.pendingCalls || 0})</span>
                </span>
                {(stats?.pendingCalls || 0) > 0 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-brand-blue rounded-full animate-pulse"></div>
                )}
              </Button>
            </Link>
            <Link href="/dashboard/routes">
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 sm:h-14 border-brand-sky text-brand-navy hover:bg-brand-sky hover:border-brand-blue hover:scale-105 transition-all duration-200 shadow-md"
              >
                <MapPin className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-brand-blue flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">
                  <span className="hidden sm:inline">Optimiser itinéraire</span>
                  <span className="sm:hidden">Itinéraire</span>
                </span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      </WidgetErrorBoundary>


      </div>
    </SmoothTransition>
  );
}
