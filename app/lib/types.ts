
// Simplified types for the application

// Error handling types
export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: AppError;
  success: boolean;
}

// Component state types
export interface LoadingState {
  isLoading: boolean;
  error: AppError | null;
}

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalOffers: number;
  totalOffersValue: number;
  winRate: number;
  pendingCalls: number;
  visitsThisWeek: number;
  topCustomers: TopCustomer[];
  offersNeedingAttention: OfferNeedingAttention[];
  upcomingVisits: UpcomingVisit[];
}

export interface TopCustomer {
  id: string;
  name: string;
  value: number;
  growth: number;
}

export interface OfferNeedingAttention {
  id: string;
  offerName: string;
  customerName: string;
  amount: number;
  status: string;
}

export interface UpcomingVisit {
  id: string;
  customer: { customerName: string };
  scheduledDate: Date;
  visitType: string;
  objective: string;
  duration?: number;
  location?: string;
}

// Customer types
export type CustomerStatus = 'ACTIVE' | 'POTENTIAL' | 'INACTIVE' | 'LEAD';
export type CustomerSegment = 'LARGE_ENTERPRISE' | 'SME' | 'B2B' | 'B2C';

export interface Customer {
  id: string;
  customerName: string;
  mainContact: string;
  contactEmail?: string;
  customerSegment: CustomerSegment;
  customerStatus: CustomerStatus;
  salesHistory: number | null;
  potentialGrowth: number | null;
  lastVisit: Date | null;
  lastPurchase: Date | null;
  activeOfferings?: string;
  mainCompetitor?: string;
  location: string;
  commercialNotes?: string;
}

// Offer types
export type OfferStatus = 'DRAFT' | 'SENT' | 'NEGOTIATION' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface Offer {
  id: string;
  offerName: string;
  customerName: string;
  amount: number;
  currency: string;
  status: OfferStatus;
  description?: string;
  dateSent: Date;
  expectedClose: Date;
  probability: number;
  nextAction?: string;
}

export interface OfferWithCustomer extends Offer {
  customer: {
    name: string;
    id: string;
  };
}

// Visit types
export type VisitType = 'PROSPECTING' | 'DEMO' | 'NEGOTIATION' | 'MAINTENANCE' | 'SUPPORT';
export type VisitStatus = 'PLANNED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export interface Visit {
  id: string;
  customerName: string;
  scheduledDate: Date;
  visitType: VisitType;
  objective: string;
  status: VisitStatus;
  duration?: number;
  location?: string;
  notes?: string;
}

// Call Plan types
export type CallPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type CallStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface CallPlan {
  id: string;
  customerName: string;
  customerId?: string;
  priority: CallPriority;
  objective: string;
  status: CallStatus;
  scheduledDate: Date;
  completedDate?: Date;
  duration?: number;
  notes?: string;
  nextAction?: string;
  result?: string;
}

// Stats interfaces
export interface CustomerStats {
  total: number;
  active: number;
  potential: number;
  totalValue: number;
}

export interface OfferStats {
  total: number;
  pending: number;
  accepted: number;
  totalValue: number;
}

export interface VisitStats {
  total: number;
  thisWeek: number;
  pending: number;
  completed: number;
}

export interface CallStats {
  total: number;
  pending: number;
  completed: number;
  highPriority: number;
}
