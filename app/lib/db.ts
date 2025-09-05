
// Demo-only database configuration - NO Prisma imports
import { createDatabaseAdapter } from './db-adapter';

// Check if we're in demo mode
const isDemoMode = process.env.NEXT_PUBLIC_APP_MODE === 'demo' || process.env.DISABLE_DATABASE === 'true';

// Export the database adapter (uses mock data for reliable deployment)
export const db = createDatabaseAdapter();

// Completely disable Prisma for demo mode
export const prisma = null;

// Mock Prisma client that throws helpful errors if accidentally used
export const PrismaClient = class {
  constructor() {
    throw new Error('Prisma is disabled in demo mode. Use the db adapter instead.');
  }
};

// Default export
export default db;
