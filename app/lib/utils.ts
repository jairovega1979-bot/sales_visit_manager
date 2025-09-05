
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Ensure proper module resolution by explicitly importing
if (typeof twMerge !== 'function' || typeof clsx !== 'function') {
  console.error('Critical modules not properly loaded: twMerge or clsx');
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for demo data
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-CH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-CH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

// Mock data generators
export function generateMockCustomers() {
  return [
    {
      id: '1',
      customerName: 'Nestlé Suisse SA',
      mainContact: 'Marie Dubois',
      customerSegment: 'Grande Entreprise',
      customerStatus: 'ACTIVE',
      salesHistory: 125000,
      potentialGrowth: 15000,
      lastVisit: new Date('2024-01-15'),
      lastPurchase: new Date('2024-01-10'),
      activeOfferings: 'Solutions CRM, Consulting',
      mainCompetitor: 'Salesforce',
      location: 'Vevey, VD',
      commercialNotes: 'Client stratégique, relation excellent avec la direction'
    },
    {
      id: '2',
      customerName: 'UBS Genève',
      mainContact: 'Pierre Martin',
      customerSegment: 'Grande Entreprise',
      customerStatus: 'ACTIVE',
      salesHistory: 98000,
      potentialGrowth: 22000,
      lastVisit: new Date('2024-01-20'),
      lastPurchase: new Date('2024-01-05'),
      activeOfferings: 'Consulting Digital, Formation',
      mainCompetitor: 'Accenture',
      location: 'Genève, GE',
      commercialNotes: 'Intéressés par transformation digitale, budget confirmé Q2'
    },
    {
      id: '3',
      customerName: 'Roche Pharmaceuticals',
      mainContact: 'Dr. Sarah Weber',
      customerSegment: 'Grande Entreprise',
      customerStatus: 'ACTIVE',
      salesHistory: 87000,
      potentialGrowth: 18000,
      lastVisit: new Date('2024-01-18'),
      lastPurchase: new Date('2024-01-12'),
      activeOfferings: 'Solutions Analytics, CRM',
      mainCompetitor: 'SAP',
      location: 'Bâle, BS',
      commercialNotes: 'Phase 1 terminée avec succès, planifier Phase 2'
    },
    {
      id: '4',
      customerName: 'Swiss Re',
      mainContact: 'Thomas Müller',
      customerSegment: 'Grande Entreprise',
      customerStatus: 'ACTIVE',
      salesHistory: 76000,
      potentialGrowth: 12000,
      lastVisit: new Date('2024-01-10'),
      lastPurchase: new Date('2023-12-15'),
      activeOfferings: 'Formation Équipe, Analytics',
      mainCompetitor: 'Microsoft',
      location: 'Zurich, ZH',
      commercialNotes: 'Relation de longue durée, satisfaction élevée'
    },
    {
      id: '5',
      customerName: 'Credit Suisse',
      mainContact: 'Anna Schneider',
      customerSegment: 'Grande Entreprise',
      customerStatus: 'ACTIVE',
      salesHistory: 65000,
      potentialGrowth: 25000,
      lastVisit: new Date('2024-01-22'),
      lastPurchase: new Date('2024-01-08'),
      activeOfferings: 'CRM Enterprise, Consulting',
      mainCompetitor: 'Oracle',
      location: 'Zurich, ZH',
      commercialNotes: 'Nouveau contact direction, très prometteur'
    },
    {
      id: '6',
      customerName: 'Novartis International',
      mainContact: 'Jean-Claude Renan',
      customerSegment: 'Grande Entreprise',
      customerStatus: 'ACTIVE',
      salesHistory: 54000,
      potentialGrowth: 16000,
      lastVisit: new Date('2024-01-12'),
      lastPurchase: new Date('2023-12-20'),
      activeOfferings: 'Solutions mobiles, Formation',
      mainCompetitor: 'Salesforce',
      location: 'Bâle, BS',
      commercialNotes: 'Évaluation solutions mobiles en cours'
    }
  ];
}

export function generateMockOffers() {
  return [
    {
      id: '1',
      offerName: 'Solution CRM Enterprise',
      customerName: 'Nestlé Suisse SA',
      amount: 45000,
      status: 'SENT',
      description: 'Implémentation complète CRM avec formation équipe',
      dateSent: new Date('2024-01-20'),
      expectedClose: new Date('2024-02-15')
    },
    // Add more mock offers...
  ];
}
