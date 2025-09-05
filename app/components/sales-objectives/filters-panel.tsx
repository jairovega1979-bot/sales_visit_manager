
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  Users, 
  MapPin, 
  Package, 
  Zap,
  Download,
  RefreshCw
} from 'lucide-react';
import { FilterOptions } from '@/lib/sales-objectives';

interface FiltersPanelProps {
  filters: FilterOptions;
  selectedFilters: {
    team: string;
    salesperson: string;
    region: string;
    productLine: string;
    channel: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
  isManager?: boolean;
}

export function FiltersPanel({
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  onExportPDF,
  onExportCSV,
  onRefresh,
  isLoading = false,
  isManager = false
}: FiltersPanelProps) {
  
  const activeFiltersCount = Object.entries(selectedFilters).filter(([key, value]) => {
    // Skip team and salesperson filters for non-managers
    if (!isManager && (key === 'team' || key === 'salesperson')) {
      return false;
    }
    return value && !value.startsWith('Tous') && !value.startsWith('Toutes');
  }).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Actions
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                Effacer tout
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filter Controls */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${isManager ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
          {/* Team Filter - Only show for managers */}
          {isManager && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Équipe
              </label>
              <Select 
                value={selectedFilters.team} 
                onValueChange={(value) => onFilterChange('team', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {filters.teams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Salesperson Filter - Only show for managers */}
          {isManager && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Vendeur
              </label>
              <Select 
                value={selectedFilters.salesperson} 
                onValueChange={(value) => onFilterChange('salesperson', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {filters.salespeople.map((person) => (
                    <SelectItem key={person} value={person}>
                      {person}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Region Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Région
            </label>
            <Select 
              value={selectedFilters.region} 
              onValueChange={(value) => onFilterChange('region', value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                {filters.regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Line Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <Package className="h-3 w-3" />
              Ligne produit
            </label>
            <Select 
              value={selectedFilters.productLine} 
              onValueChange={(value) => onFilterChange('productLine', value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                {filters.productLines.map((line) => (
                  <SelectItem key={line} value={line}>
                    {line}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Channel Filter */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Canal
            </label>
            <Select 
              value={selectedFilters.channel} 
              onValueChange={(value) => onFilterChange('channel', value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                {filters.channels.map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="border-t pt-3">
            <div className="text-xs font-medium text-gray-600 mb-2">Filtres actifs:</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedFilters).map(([key, value]) => {
                if (!value || value.startsWith('Tous') || value.startsWith('Toutes')) return null;
                
                // Skip team and salesperson filters for non-managers
                if (!isManager && (key === 'team' || key === 'salesperson')) {
                  return null;
                }
                
                const labels: Record<string, string> = {
                  team: 'Équipe',
                  salesperson: 'Vendeur',
                  region: 'Région',
                  productLine: 'Produit',
                  channel: 'Canal'
                };

                return (
                  <Badge 
                    key={key} 
                    variant="secondary" 
                    className="flex items-center gap-1 bg-blue-50 text-blue-700"
                  >
                    <span className="text-xs">{labels[key]}:</span>
                    <span className="font-medium">{value}</span>
                    <button
                      onClick={() => onFilterChange(key, filters[key as keyof FilterOptions][0])}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Export Actions */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-gray-600">Exporter les données:</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExportCSV}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExportPDF}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
          <div className="font-medium mb-1">Résumé de la vue actuelle:</div>
          <div className="space-y-1">
            <div>• Période analysée avec filtres appliqués</div>
            <div>• Données mises à jour quotidiennement à 08:00</div>
            <div>• Les objectifs sont définis par la Direction des Ventes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
