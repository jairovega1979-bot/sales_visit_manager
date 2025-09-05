
// Hook principal para el manejo de datos con el adaptador de base de datos
'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/db';
import { MockUser, MockCustomer, MockOffer, MockVisit, MockAppointment } from '@/lib/mock-data';

// Hook para usuarios
export function useUsers() {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await db.getUsers();
      setUsers(data);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

// Hook pour les clients
export function useCustomers(userId?: string) {
  const [customers, setCustomers] = useState<MockCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = userId 
        ? await db.getCustomersByUserId(userId)
        : await db.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Erreur lors du chargement des clients');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const createCustomer = useCallback(async (data: Partial<MockCustomer>) => {
    try {
      const newCustomer = await db.createCustomer(data);
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (err) {
      setError('Erreur lors de la création du client');
      throw err;
    }
  }, []);

  const updateCustomer = useCallback(async (id: string, data: Partial<MockCustomer>) => {
    try {
      const updatedCustomer = await db.updateCustomer(id, data);
      if (updatedCustomer) {
        setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      }
      return updatedCustomer;
    } catch (err) {
      setError('Erreur lors de la mise à jour du client');
      throw err;
    }
  }, []);

  const deleteCustomer = useCallback(async (id: string) => {
    try {
      await db.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du client');
      throw err;
    }
  }, []);

  return { 
    customers, 
    loading, 
    error, 
    refetch: fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
  };
}

// Hook pour les offres
export function useOffers(userId?: string, customerId?: string) {
  const [offers, setOffers] = useState<MockOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data: MockOffer[];
      
      if (customerId) {
        data = await db.getOffersByCustomerId(customerId);
      } else if (userId) {
        data = await db.getOffersByUserId(userId);
      } else {
        data = await db.getOffers();
      }
      
      setOffers(data);
    } catch (err) {
      setError('Erreur lors du chargement des offres');
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, customerId]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const createOffer = useCallback(async (data: Partial<MockOffer>) => {
    try {
      const newOffer = await db.createOffer(data);
      setOffers(prev => [...prev, newOffer]);
      return newOffer;
    } catch (err) {
      setError('Erreur lors de la création de l\'offre');
      throw err;
    }
  }, []);

  const updateOffer = useCallback(async (id: string, data: Partial<MockOffer>) => {
    try {
      const updatedOffer = await db.updateOffer(id, data);
      if (updatedOffer) {
        setOffers(prev => prev.map(o => o.id === id ? updatedOffer : o));
      }
      return updatedOffer;
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'offre');
      throw err;
    }
  }, []);

  const deleteOffer = useCallback(async (id: string) => {
    try {
      await db.deleteOffer(id);
      setOffers(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de l\'offre');
      throw err;
    }
  }, []);

  return { 
    offers, 
    loading, 
    error, 
    refetch: fetchOffers,
    createOffer,
    updateOffer,
    deleteOffer
  };
}

// Hook pour les visites
export function useVisits(userId?: string, customerId?: string) {
  const [visits, setVisits] = useState<MockVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data: MockVisit[];
      
      if (customerId) {
        data = await db.getVisitsByCustomerId(customerId);
      } else if (userId) {
        data = await db.getVisitsByUserId(userId);
      } else {
        data = await db.getVisits();
      }
      
      setVisits(data);
    } catch (err) {
      setError('Erreur lors du chargement des visites');
      console.error('Error fetching visits:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, customerId]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const createVisit = useCallback(async (data: Partial<MockVisit>) => {
    try {
      const newVisit = await db.createVisit(data);
      setVisits(prev => [...prev, newVisit]);
      return newVisit;
    } catch (err) {
      setError('Erreur lors de la création de la visite');
      throw err;
    }
  }, []);

  const updateVisit = useCallback(async (id: string, data: Partial<MockVisit>) => {
    try {
      const updatedVisit = await db.updateVisit(id, data);
      if (updatedVisit) {
        setVisits(prev => prev.map(v => v.id === id ? updatedVisit : v));
      }
      return updatedVisit;
    } catch (err) {
      setError('Erreur lors de la mise à jour de la visite');
      throw err;
    }
  }, []);

  const deleteVisit = useCallback(async (id: string) => {
    try {
      await db.deleteVisit(id);
      setVisits(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de la visite');
      throw err;
    }
  }, []);

  return { 
    visits, 
    loading, 
    error, 
    refetch: fetchVisits,
    createVisit,
    updateVisit,
    deleteVisit
  };
}

// Hook pour les rendez-vous
export function useAppointments(userId?: string, date?: string) {
  const [appointments, setAppointments] = useState<MockAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data: MockAppointment[];
      
      if (date) {
        data = await db.getAppointmentsByDate(date, userId);
      } else if (userId) {
        data = await db.getAppointmentsByUserId(userId);
      } else {
        data = await db.getAppointments();
      }
      
      setAppointments(data);
    } catch (err) {
      setError('Erreur lors du chargement des rendez-vous');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, date]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const createAppointment = useCallback(async (data: Partial<MockAppointment>) => {
    try {
      const newAppointment = await db.createAppointment(data);
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      setError('Erreur lors de la création du rendez-vous');
      throw err;
    }
  }, []);

  const updateAppointment = useCallback(async (id: string, data: Partial<MockAppointment>) => {
    try {
      const updatedAppointment = await db.updateAppointment(id, data);
      if (updatedAppointment) {
        setAppointments(prev => prev.map(a => a.id === id ? updatedAppointment : a));
      }
      return updatedAppointment;
    } catch (err) {
      setError('Erreur lors de la mise à jour du rendez-vous');
      throw err;
    }
  }, []);

  const deleteAppointment = useCallback(async (id: string) => {
    try {
      await db.deleteAppointment(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du rendez-vous');
      throw err;
    }
  }, []);

  return { 
    appointments, 
    loading, 
    error, 
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
  };
}

// Hook pour obtenir des statistiques rapides
export function useStats(userId?: string) {
  const { customers } = useCustomers(userId);
  const { offers } = useOffers(userId);
  const { visits } = useVisits(userId);
  const { appointments } = useAppointments(userId);

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.customerStatus === 'ACTIVE').length,
    totalOffers: offers.length,
    activeOffers: offers.filter(o => ['SENT', 'NEGOTIATION'].includes(o.status)).length,
    totalRevenue: offers.filter(o => o.status === 'WON').reduce((sum, o) => sum + o.amount, 0),
    pipelineValue: offers.filter(o => ['SENT', 'NEGOTIATION'].includes(o.status)).reduce((sum, o) => sum + o.amount, 0),
    completedVisits: visits.filter(v => v.status === 'COMPLETED').length,
    plannedVisits: visits.filter(v => v.status === 'PLANNED').length,
    upcomingAppointments: appointments.filter(a => {
      const appointmentDate = new Date(a.startTime);
      const now = new Date();
      return appointmentDate > now && a.status === 'SCHEDULED';
    }).length
  };

  return stats;
}
