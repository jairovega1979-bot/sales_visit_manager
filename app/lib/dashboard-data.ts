export const dynamic = "force-dynamic";

import { db } from '@/lib/db';
import { DashboardStats } from '@/lib/types';

// UserRole type for demo mode
type UserRole = 'SALES_REP' | 'MANAGER' | 'ADMIN';

export async function getDashboardStats(userId: string, userRole?: UserRole | string): Promise<DashboardStats> {
  try {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Get all data using our database adapter
    const allCustomers = await db.getCustomers();
    const allOffers = await db.getOffers();
    const allVisits = await db.getVisits();

    // Filter data based on user role
    const customers = userRole === 'MANAGER' 
      ? allCustomers 
      : allCustomers.filter(c => c.assignedUserId === userId);

    const offers = userRole === 'MANAGER'
      ? allOffers
      : allOffers.filter(o => o.assignedUserId === userId);

    const visits = userRole === 'MANAGER'
      ? allVisits
      : allVisits.filter(v => v.assignedUserId === userId);

    // Calculate stats
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.customerStatus === 'ACTIVE').length;
    const totalOffers = offers.length;
    const totalOffersValue = offers.reduce((sum, offer) => sum + offer.amount, 0);

    // Calculate win rate (using WON status from mock data)
    const wonOffers = offers.filter(offer => offer.status === 'WON');
    const winRate = totalOffers > 0 ? Math.round((wonOffers.length / totalOffers) * 100) : 0;

    // Get visits for this week
    const visitsThisWeek = visits.filter(visit => {
      const visitDate = new Date(visit.scheduledDate);
      return visitDate >= weekStart && visitDate <= weekEnd;
    }).length;

    // Mock pending calls
    const pendingCalls = Math.floor(Math.random() * 15) + 5;

    // Get top customers by offer value
    const customerOfferMap = new Map();
    
    // Initialize all customers with 0 value
    customers.forEach(customer => {
      customerOfferMap.set(customer.id, {
        id: customer.id,
        name: customer.customerName,
        value: 0,
        growth: customer.potentialGrowth || Math.floor(Math.random() * 50000)
      });
    });

    // Add offer values for won offers
    wonOffers.forEach(offer => {
      const existing = customerOfferMap.get(offer.customerId);
      if (existing) {
        existing.value += offer.amount;
      }
    });

    const topCustomers = Array.from(customerOfferMap.values())
      .filter(customer => customer.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Get offers needing attention (SENT and NEGOTIATION status)
    const offersNeedingAttention = offers
      .filter(offer => offer.status === 'SENT' || offer.status === 'NEGOTIATION')
      .map(offer => ({
        id: offer.id,
        offerName: offer.offerName,
        customerName: offer.customerName,
        amount: offer.amount,
        status: offer.status
      }))
      .slice(0, 5);

    // Get upcoming visits (next 7 days)
    const upcomingStart = new Date(now);
    upcomingStart.setHours(0, 0, 0, 0);
    const upcomingEnd = new Date(now);
    upcomingEnd.setDate(now.getDate() + 7);
    upcomingEnd.setHours(23, 59, 59, 999);

    const upcomingVisits = visits
      .filter(visit => {
        const visitDate = new Date(visit.scheduledDate);
        return visitDate >= upcomingStart && visitDate <= upcomingEnd && visit.status === 'PLANNED';
      })
      .map(visit => {
        // Find customer name by customerId
        const customer = customers.find(c => c.id === visit.customerId);
        return {
          id: visit.id,
          customer: { customerName: customer?.customerName || 'Unknown Customer' },
          scheduledDate: new Date(visit.scheduledDate),
          visitType: visit.visitType,
          objective: visit.objective || 'No objective specified',
          duration: visit.duration,
          location: visit.location
        };
      })
      .slice(0, 5);

    return {
      totalCustomers,
      activeCustomers,
      totalOffers,
      totalOffersValue,
      winRate,
      pendingCalls,
      visitsThisWeek,
      topCustomers: topCustomers.length > 0 ? topCustomers : getMockTopCustomers(),
      offersNeedingAttention: offersNeedingAttention.length > 0 ? offersNeedingAttention : getMockOffersNeedingAttention(),
      upcomingVisits: upcomingVisits.length > 0 ? upcomingVisits : getMockUpcomingVisits()
    };

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return getMockDashboardStats();
  }
}

// Mock data functions
function getMockTopCustomers() {
  return [
    { id: '1', name: 'Nestlé Suisse SA', value: 125000, growth: 15000 },
    { id: '2', name: 'UBS Genève', value: 98000, growth: 22000 },
    { id: '3', name: 'Roche Pharmaceuticals', value: 87000, growth: 12000 },
    { id: '4', name: 'Rolex SA', value: 76000, growth: 18000 },
    { id: '5', name: 'Credit Suisse', value: 65000, growth: 8000 }
  ];
}

function getMockOffersNeedingAttention() {
  return [
    { id: '1', offerName: 'Système CRM Enterprise', customerName: 'Nestlé Suisse SA', amount: 85000, status: 'NEGOTIATION' },
    { id: '2', offerName: 'Solution Banking Digital', customerName: 'UBS Genève', amount: 120000, status: 'SENT' },
    { id: '3', offerName: 'Plateforme Analytics', customerName: 'Roche Pharmaceuticals', amount: 95000, status: 'NEGOTIATION' },
    { id: '4', offerName: 'Infrastructure Cloud', customerName: 'Rolex SA', amount: 65000, status: 'SENT' }
  ];
}

function getMockUpcomingVisits() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 3);
  
  return [
    {
      id: '1',
      customer: { customerName: 'Nestlé Suisse SA' },
      scheduledDate: tomorrow,
      visitType: 'DEMO',
      objective: 'Présentation du système CRM',
      duration: 120,
      location: 'Vevey, Suisse'
    },
    {
      id: '2',
      customer: { customerName: 'UBS Genève' },
      scheduledDate: nextWeek,
      visitType: 'NEGOTIATION',
      objective: 'Finalisation du contrat',
      duration: 90,
      location: 'Genève, Suisse'
    }
  ];
}

function getMockDashboardStats(): DashboardStats {
  return {
    totalCustomers: 156,
    activeCustomers: 134,
    totalOffers: 45,
    totalOffersValue: 2850000,
    winRate: 68,
    pendingCalls: 12,
    visitsThisWeek: 8,
    topCustomers: getMockTopCustomers(),
    offersNeedingAttention: getMockOffersNeedingAttention(),
    upcomingVisits: getMockUpcomingVisits()
  };
}