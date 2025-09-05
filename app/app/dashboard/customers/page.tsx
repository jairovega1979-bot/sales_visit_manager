
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { generateMockCustomers, formatCurrency, formatDate } from '@/lib/utils';
import { Search, Plus, MapPin, Phone, Mail } from 'lucide-react';

export default function CustomersPage() {
  const [customers] = useState(generateMockCustomers());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-brand-sky/30 space-y-4 sm:space-y-0">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy bg-gradient-to-r from-brand-navy to-brand-blue bg-clip-text text-transparent break-words">
            Clients
          </h1>
          <p className="text-brand-navy/70 mt-1 sm:mt-2 text-sm sm:text-base md:text-lg">Gérez votre portefeuille client</p>
        </div>
        <Button className="bg-brand-navy hover:bg-brand-blue text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          <span className="sm:hidden">Ajouter un nouveau client</span>
          <span className="hidden sm:inline">Nouveau Client</span>
        </Button>
      </div>

      {/* Search - Mobile Optimized */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-brand-blue h-4 w-4 sm:h-5 sm:w-5" />
          <Input
            placeholder="Rechercher des clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 sm:pl-12 h-10 sm:h-12 border-brand-sky bg-white/80 backdrop-blur-sm shadow-md focus:ring-brand-blue focus:border-brand-blue text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Stats Cards - Mobile Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hexagon-decoration">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-navy">47</div>
            <div className="text-xs sm:text-sm text-brand-navy/70 font-medium">Total Clients</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-blue">42</div>
            <div className="text-xs sm:text-sm text-brand-navy/70 font-medium">Clients Actifs</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-light-blue">5</div>
            <div className="text-xs sm:text-sm text-brand-navy/70 font-medium">Prospects</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-brand-navy">CHF 1.2M</div>
            <div className="text-xs sm:text-sm text-brand-navy/70 font-medium">Valeur Portfolio</div>
          </CardContent>
        </Card>
      </div>

      {/* Customers List - Mobile Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-logo-watermark">
            <CardHeader className="bg-brand-gradient-soft rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-brand-navy font-bold">{customer.customerName}</CardTitle>
                  <div className="flex items-center text-sm text-brand-navy/70 mt-2">
                    <MapPin className="h-4 w-4 mr-1 text-brand-blue" />
                    {customer.location}
                  </div>
                </div>
                <Badge 
                  variant={customer.customerStatus === 'ACTIVE' ? 'default' : 'secondary'}
                  className={customer.customerStatus === 'ACTIVE' ? 'bg-brand-blue text-white' : 'bg-brand-sky text-brand-navy'}
                >
                  {customer.customerStatus === 'ACTIVE' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 relative z-10">
              <div className="space-y-4">
                <div className="bg-brand-sky/20 p-3 rounded-xl">
                  <div className="flex items-center text-sm text-brand-navy">
                    <Phone className="h-4 w-4 mr-2 text-brand-blue" />
                    <span className="font-medium">Contact Principal:</span> {customer.mainContact}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/60 p-3 rounded-xl">
                    <span className="font-semibold text-brand-navy">Segment:</span>
                    <div className="text-brand-navy/80 mt-1">{customer.customerSegment}</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl">
                    <span className="font-semibold text-brand-navy">Ventes:</span>
                    <div className="text-brand-blue font-bold text-lg mt-1">
                      {formatCurrency(customer.salesHistory)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/60 p-3 rounded-xl">
                    <span className="font-semibold text-brand-navy">Potentiel:</span>
                    <div className="text-brand-light-blue font-bold text-lg mt-1">
                      {formatCurrency(customer.potentialGrowth)}
                    </div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl">
                    <span className="font-semibold text-brand-navy">Dernière visite:</span>
                    <div className="text-brand-navy/80 mt-1">
                      {customer.lastVisit ? formatDate(customer.lastVisit) : 'Aucune'}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-sky/30">
                  <div className="text-xs text-brand-navy/70 mb-2 font-medium">Offres actives:</div>
                  <div className="text-sm text-brand-navy bg-brand-sky/20 p-2 rounded-lg">{customer.activeOfferings}</div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button size="sm" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:scale-105 transition-all duration-200">
                    <Phone className="h-4 w-4 mr-1" />
                    Appeler
                  </Button>
                  <Button size="sm" variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:scale-105 transition-all duration-200">
                    <Mail className="h-4 w-4 mr-1" />
                    Visiter
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
