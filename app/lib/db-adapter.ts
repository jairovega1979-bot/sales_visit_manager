
// Database adapter que peut basculer entre Prisma et MockData selon l'environnement
import { MockDataManager, MockUser, MockCustomer, MockOffer, MockVisit, MockAppointment } from './mock-data';

// Interface unifiée pour les opérations de base de données
export interface DatabaseAdapter {
  // User operations
  getUsers(): Promise<MockUser[]>;
  getUserById(id: string): Promise<MockUser | null>;
  getUserByEmail(email: string): Promise<MockUser | null>;

  // Customer operations
  getCustomers(): Promise<MockCustomer[]>;
  getCustomerById(id: string): Promise<MockCustomer | null>;
  getCustomersByUserId(userId: string): Promise<MockCustomer[]>;
  createCustomer(data: Partial<MockCustomer>): Promise<MockCustomer>;
  updateCustomer(id: string, data: Partial<MockCustomer>): Promise<MockCustomer | null>;
  deleteCustomer(id: string): Promise<MockCustomer | null>;

  // Offer operations
  getOffers(): Promise<MockOffer[]>;
  getOfferById(id: string): Promise<MockOffer | null>;
  getOffersByUserId(userId: string): Promise<MockOffer[]>;
  getOffersByCustomerId(customerId: string): Promise<MockOffer[]>;
  createOffer(data: Partial<MockOffer>): Promise<MockOffer>;
  updateOffer(id: string, data: Partial<MockOffer>): Promise<MockOffer | null>;
  deleteOffer(id: string): Promise<MockOffer | null>;

  // Visit operations
  getVisits(): Promise<MockVisit[]>;
  getVisitById(id: string): Promise<MockVisit | null>;
  getVisitsByUserId(userId: string): Promise<MockVisit[]>;
  getVisitsByCustomerId(customerId: string): Promise<MockVisit[]>;
  createVisit(data: Partial<MockVisit>): Promise<MockVisit>;
  updateVisit(id: string, data: Partial<MockVisit>): Promise<MockVisit | null>;
  deleteVisit(id: string): Promise<MockVisit | null>;

  // Appointment operations
  getAppointments(): Promise<MockAppointment[]>;
  getAppointmentById(id: string): Promise<MockAppointment | null>;
  getAppointmentsByUserId(userId: string): Promise<MockAppointment[]>;
  getAppointmentsByDate(date: string, userId?: string): Promise<MockAppointment[]>;
  createAppointment(data: Partial<MockAppointment>): Promise<MockAppointment>;
  updateAppointment(id: string, data: Partial<MockAppointment>): Promise<MockAppointment | null>;
  deleteAppointment(id: string): Promise<MockAppointment | null>;
}

// Adaptateur pour les données mock (utilisé pour le déploiement)
class MockDatabaseAdapter implements DatabaseAdapter {
  private dataManager = MockDataManager.getInstance();

  async getUsers(): Promise<MockUser[]> {
    return this.dataManager.getUsers();
  }

  async getUserById(id: string): Promise<MockUser | null> {
    return this.dataManager.getUserById(id) || null;
  }

  async getUserByEmail(email: string): Promise<MockUser | null> {
    return this.dataManager.getUserByEmail(email) || null;
  }

  async getCustomers(): Promise<MockCustomer[]> {
    return this.dataManager.getCustomers();
  }

  async getCustomerById(id: string): Promise<MockCustomer | null> {
    return this.dataManager.getCustomerById(id) || null;
  }

  async getCustomersByUserId(userId: string): Promise<MockCustomer[]> {
    return this.dataManager.getCustomersByUserId(userId);
  }

  async createCustomer(data: Partial<MockCustomer>): Promise<MockCustomer> {
    return this.dataManager.createCustomer(data);
  }

  async updateCustomer(id: string, data: Partial<MockCustomer>): Promise<MockCustomer | null> {
    return this.dataManager.updateCustomer(id, data);
  }

  async deleteCustomer(id: string): Promise<MockCustomer | null> {
    return this.dataManager.deleteCustomer(id);
  }

  async getOffers(): Promise<MockOffer[]> {
    return this.dataManager.getOffers();
  }

  async getOfferById(id: string): Promise<MockOffer | null> {
    return this.dataManager.getOfferById(id) || null;
  }

  async getOffersByUserId(userId: string): Promise<MockOffer[]> {
    return this.dataManager.getOffersByUserId(userId);
  }

  async getOffersByCustomerId(customerId: string): Promise<MockOffer[]> {
    return this.dataManager.getOffersByCustomerId(customerId);
  }

  async createOffer(data: Partial<MockOffer>): Promise<MockOffer> {
    return this.dataManager.createOffer(data);
  }

  async updateOffer(id: string, data: Partial<MockOffer>): Promise<MockOffer | null> {
    return this.dataManager.updateOffer(id, data);
  }

  async deleteOffer(id: string): Promise<MockOffer | null> {
    return this.dataManager.deleteOffer(id);
  }

  async getVisits(): Promise<MockVisit[]> {
    return this.dataManager.getVisits();
  }

  async getVisitById(id: string): Promise<MockVisit | null> {
    return this.dataManager.getVisitById(id) || null;
  }

  async getVisitsByUserId(userId: string): Promise<MockVisit[]> {
    return this.dataManager.getVisitsByUserId(userId);
  }

  async getVisitsByCustomerId(customerId: string): Promise<MockVisit[]> {
    return this.dataManager.getVisitsByCustomerId(customerId);
  }

  async createVisit(data: Partial<MockVisit>): Promise<MockVisit> {
    return this.dataManager.createVisit(data);
  }

  async updateVisit(id: string, data: Partial<MockVisit>): Promise<MockVisit | null> {
    return this.dataManager.updateVisit(id, data);
  }

  async deleteVisit(id: string): Promise<MockVisit | null> {
    return this.dataManager.deleteVisit(id);
  }

  async getAppointments(): Promise<MockAppointment[]> {
    return this.dataManager.getAppointments();
  }

  async getAppointmentById(id: string): Promise<MockAppointment | null> {
    return this.dataManager.getAppointmentById(id) || null;
  }

  async getAppointmentsByUserId(userId: string): Promise<MockAppointment[]> {
    return this.dataManager.getAppointmentsByUserId(userId);
  }

  async getAppointmentsByDate(date: string, userId?: string): Promise<MockAppointment[]> {
    return this.dataManager.getAppointmentsByDate(date, userId);
  }

  async createAppointment(data: Partial<MockAppointment>): Promise<MockAppointment> {
    return this.dataManager.createAppointment(data);
  }

  async updateAppointment(id: string, data: Partial<MockAppointment>): Promise<MockAppointment | null> {
    return this.dataManager.updateAppointment(id, data);
  }

  async deleteAppointment(id: string): Promise<MockAppointment | null> {
    return this.dataManager.deleteAppointment(id);
  }
}

// Factory pour créer l'adaptateur approprié
export function createDatabaseAdapter(): DatabaseAdapter {
  // Pour le déploiement, utiliser toujours les données mock
  return new MockDatabaseAdapter();
}

// Export de l'adaptateur par défaut
export const db = createDatabaseAdapter();
export default db;
