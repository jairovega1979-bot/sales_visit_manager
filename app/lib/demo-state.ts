

// Shared state for demo mode - simulates database persistence during session
import MockDataManager from './mock-data';

// Unified demo state using MockDataManager
class DemoStateManager {
  private static instance: DemoStateManager;
  private mockManager: MockDataManager;

  private constructor() {
    this.mockManager = MockDataManager.getInstance();
  }

  static getInstance(): DemoStateManager {
    if (!DemoStateManager.instance) {
      DemoStateManager.instance = new DemoStateManager();
    }
    return DemoStateManager.instance;
  }

  // Get the underlying MockDataManager instance
  getManager(): MockDataManager {
    return this.mockManager;
  }

  // Legacy compatibility methods - redirect to MockDataManager
  get appointments() {
    return this.mockManager.getAppointments();
  }

  get offers() {
    return this.mockManager.getOffers();
  }

  get customers() {
    return this.mockManager.getCustomers();
  }

  get visits() {
    return this.mockManager.getVisits();
  }

  get users() {
    return this.mockManager.getUsers();
  }

  // New prospects access
  get prospects() {
    return this.mockManager.getProspects();
  }

  // Reset all data to original mock data
  resetData() {
    // MockDataManager automatically handles data reset
    // The singleton pattern ensures data consistency
  }
}

export const demoState = DemoStateManager.getInstance();
export default demoState;
