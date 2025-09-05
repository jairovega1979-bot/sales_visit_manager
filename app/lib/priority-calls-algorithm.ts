
interface Customer {
  id: string;
  customerName: string;
  customerSegment: string;
  lastVisit?: Date | null;
  lastPurchase?: Date | null;
  salesHistory?: number | null;
  location?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
}

interface Visit {
  id: string;
  customerId: string;
  actualDate?: Date | null;
  scheduledDate: Date;
}

interface CallPlan {
  id: string;
  customerId: string;
  completedAt?: Date | null;
}

export interface PriorityCallRecommendation {
  id: string;
  customerId: string;
  customerName: string;
  priority: number; // 1-100, higher = more priority
  reason: string;
  lastVisit?: Date;
  lastCall?: Date;
  lastPurchase?: Date;
  salesHistory?: number;
  segment: string;
  location?: string;
  phone?: string;
  email?: string;
  estimatedValue: number;
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  tags: string[];
}

export interface CallRecommendationCriteria {
  topCustomers: Customer[]; // Top 100 customers from previous year
  currentYearPurchases: Customer[]; // Customers who already purchased this year
  upcomingRoutes: { customerId: string; routeDate: Date; location: string }[]; // Next 10 working days routes
  allCustomers: (Customer & {
    visits: Visit[];
    callPlans: CallPlan[];
  })[];
  recentCalls: CallRecord[]; // Recent calls from last 30 days
  persistentRecommendations: PersistentRecommendation[]; // Customers not contacted from previous days
}

export interface CallRecord {
  id: string;
  customerId: string;
  callDate: Date;
  result: 'ANSWERED' | 'NO_ANSWER' | 'BUSY' | 'VOICEMAIL' | 'SCHEDULED_CALLBACK' | 'NOT_INTERESTED' | 'SUCCESSFUL';
  notes?: string;
  followUpRequired?: boolean;
  nextContactDate?: Date;
}

export interface PersistentRecommendation {
  customerId: string;
  customerName: string;
  firstRecommendedDate: Date;
  daysPersisted: number;
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  lastAttemptDate?: Date;
  attemptCount: number;
  managerNotified: boolean;
  priority: number;
}

export interface ManagerAlertSettings {
  enableAlerts: boolean;
  alertAfterDays: number; // Alert manager after X days of non-contact
  alertFrequency: 'DAILY' | 'EVERY_2_DAYS' | 'WEEKLY';
  emailNotifications: boolean;
  managerEmail?: string;
}

export interface ManagerAlert {
  id: string;
  type: 'PERSISTENT_CLIENT' | 'CRITICAL_MISSED' | 'HIGH_VALUE_MISSED';
  customerId: string;
  customerName: string;
  message: string;
  daysPersisted: number;
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedValue: number;
  createdAt: Date;
  acknowledged: boolean;
}

export class PriorityCallsAlgorithm {
  private static readonly WEIGHTS = {
    TOP_CUSTOMER_NO_PURCHASE: 30,
    LAST_VISIT_TIME: 25,
    LAST_CALL_TIME: 20,
    ROUTE_CONVENIENCE: 15,
    PURCHASE_PERIODICITY: 10,
    PERSISTENT_CLIENT: 15 // New weight for clients persisted from previous days
  };

  private static readonly PERSISTENCE_DAYS = 5; // Days to keep non-contacted clients
  private static readonly CONTACT_EXCLUSION_DAYS = 30; // Don't recommend clients contacted in last 30 days

  static generateDailyRecommendations(
    criteria: CallRecommendationCriteria,
    targetCount: number = 20,
    managerSettings?: ManagerAlertSettings
  ): { 
    recommendations: PriorityCallRecommendation[]; 
    managerAlerts: ManagerAlert[];
    persistentClients: PersistentRecommendation[];
  } {
    const recommendations: PriorityCallRecommendation[] = [];
    const managerAlerts: ManagerAlert[] = [];
    const newPersistentClients: PersistentRecommendation[] = [];
    
    // Step 1: Process persistent recommendations from previous days
    const persistentRecs = this.processPersistentRecommendations(
      criteria.persistentRecommendations,
      criteria.recentCalls,
      managerSettings
    );

    persistentRecs.validPersistent.forEach(persistent => {
      const customer = criteria.allCustomers.find(c => c.id === persistent.customerId);
      if (customer) {
        const rec = this.createPersistentRecommendation(persistent, customer);
        if (rec) recommendations.push(rec);
      }
    });

    // Add manager alerts for persistent clients
    managerAlerts.push(...persistentRecs.alerts);
    newPersistentClients.push(...persistentRecs.updatedPersistent);

    // Step 2: Filter out customers contacted in last 30 days
    const recentlyContactedIds = new Set(
      criteria.recentCalls
        .filter(call => this.daysDifference(new Date(), call.callDate) <= this.CONTACT_EXCLUSION_DAYS)
        .map(call => call.customerId)
    );

    // Step 3: Generate new recommendations for customers not recently contacted
    const availableCustomers = criteria.allCustomers.filter(customer => 
      !recentlyContactedIds.has(customer.id) &&
      !persistentRecs.validPersistent.some(p => p.customerId === customer.id)
    );

    for (const customer of availableCustomers) {
      const recommendation = this.calculateCustomerPriority(customer, criteria);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    }

    // Step 4: Sort and limit recommendations
    const finalRecommendations = recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, targetCount);

    // Step 5: Track new recommendations for persistence (clients not contacted today)
    const today = new Date();
    finalRecommendations.forEach(rec => {
      if (!persistentRecs.validPersistent.some(p => p.customerId === rec.customerId)) {
        newPersistentClients.push({
          customerId: rec.customerId,
          customerName: rec.customerName,
          firstRecommendedDate: today,
          daysPersisted: 0,
          urgencyLevel: rec.urgencyLevel,
          attemptCount: 0,
          managerNotified: false,
          priority: rec.priority
        });
      }
    });

    return {
      recommendations: finalRecommendations,
      managerAlerts,
      persistentClients: newPersistentClients
    };
  }

  private static calculateCustomerPriority(
    customer: Customer & {
      visits: Visit[];
      callPlans: CallPlan[];
    },
    criteria: CallRecommendationCriteria
  ): PriorityCallRecommendation | null {
    let priorityScore = 0;
    const reasons: string[] = [];
    const tags: string[] = [];

    // Criterion 1: Top 100 customer from last year who hasn't purchased this year
    const isTopCustomer = criteria.topCustomers.some(tc => tc.id === customer.id);
    const hasPurchasedThisYear = criteria.currentYearPurchases.some(cp => cp.id === customer.id);
    
    if (isTopCustomer && !hasPurchasedThisYear) {
      priorityScore += this.WEIGHTS.TOP_CUSTOMER_NO_PURCHASE;
      reasons.push('Client TOP 100 sans achat cette année');
      tags.push('TOP_CLIENT');
      tags.push('AUCUN_ACHAT');
    }

    // Criterion 2: Time since last visit
    const lastVisit = customer.visits
      .filter((v: Visit) => v.actualDate)
      .sort((a: Visit, b: Visit) => (b.actualDate?.getTime() || 0) - (a.actualDate?.getTime() || 0))[0];

    if (lastVisit?.actualDate) {
      const daysSinceLastVisit = this.daysDifference(new Date(), lastVisit.actualDate);
      const visitScore = Math.min(daysSinceLastVisit / 30, 1) * this.WEIGHTS.LAST_VISIT_TIME;
      priorityScore += visitScore;
      
      if (daysSinceLastVisit > 90) {
        reasons.push(`Dernière visite il y a ${daysSinceLastVisit} jours`);
        tags.push('VISITE_ANCIENNE');
      } else if (daysSinceLastVisit > 60) {
        reasons.push(`Visite datant de ${daysSinceLastVisit} jours`);
        tags.push('VISITE_RÉCENTE');
      }
    } else {
      priorityScore += this.WEIGHTS.LAST_VISIT_TIME;
      reasons.push('Aucune visite enregistrée');
      tags.push('JAMAIS_VISITÉ');
    }

    // Criterion 3: Time since last call
    const lastCall = customer.callPlans
      .filter((cp: CallPlan) => cp.completedAt)
      .sort((a: CallPlan, b: CallPlan) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))[0];

    if (lastCall?.completedAt) {
      const daysSinceLastCall = this.daysDifference(new Date(), lastCall.completedAt);
      const callScore = Math.min(daysSinceLastCall / 21, 1) * this.WEIGHTS.LAST_CALL_TIME;
      priorityScore += callScore;
      
      if (daysSinceLastCall > 30) {
        reasons.push(`Dernier appel il y a ${daysSinceLastCall} jours`);
        tags.push('APPEL_ANCIEN');
      }
    } else {
      priorityScore += this.WEIGHTS.LAST_CALL_TIME;
      reasons.push('Aucun appel enregistré');
      tags.push('JAMAIS_APPELÉ');
    }

    // Criterion 4: Route convenience (next 10 working days)
    const isOnUpcomingRoute = criteria.upcomingRoutes.some(route => 
      route.customerId === customer.id &&
      this.isWithinNext10WorkingDays(route.routeDate)
    );

    if (isOnUpcomingRoute) {
      priorityScore += this.WEIGHTS.ROUTE_CONVENIENCE;
      reasons.push('Dans l\'itinéraire des 10 prochains jours');
      tags.push('ITINÉRAIRE_PRÉVU');
    }

    // Criterion 5: Purchase periodicity
    if (customer.lastPurchase) {
      const daysSinceLastPurchase = this.daysDifference(new Date(), customer.lastPurchase);
      const averagePurchaseCycle = this.estimatePurchaseCycle(customer);
      
      if (daysSinceLastPurchase >= averagePurchaseCycle * 0.8) {
        priorityScore += this.WEIGHTS.PURCHASE_PERIODICITY;
        reasons.push('Cycle d\'achat habituel approche');
        tags.push('CYCLE_ACHAT');
      }
    }

    // Only return recommendation if it has some priority
    if (priorityScore < 10) return null;

    const urgencyLevel = this.determineUrgencyLevel(priorityScore, tags);
    const estimatedValue = customer.salesHistory || this.estimateValueBySegment(customer.customerSegment);

    return {
      id: `rec-${customer.id}-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.customerName,
      priority: Math.round(priorityScore),
      reason: reasons.join(' • '),
      lastVisit: lastVisit?.actualDate || undefined,
      lastCall: lastCall?.completedAt || undefined,
      lastPurchase: customer.lastPurchase || undefined,
      salesHistory: customer.salesHistory || undefined,
      segment: customer.customerSegment,
      location: customer.location || undefined,
      phone: customer.contactPhone || undefined,
      email: customer.contactEmail || undefined,
      estimatedValue,
      urgencyLevel,
      tags
    };
  }

  private static daysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private static isWithinNext10WorkingDays(date: Date): boolean {
    const today = new Date();
    const workingDaysCount = 10;
    let currentDate = new Date(today);
    let workingDaysAdded = 0;

    while (workingDaysAdded < workingDaysCount) {
      currentDate.setDate(currentDate.getDate() + 1);
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        workingDaysAdded++;
      }
      
      // Check if the route date matches
      if (this.isSameDay(currentDate, date)) {
        return true;
      }
    }
    
    return false;
  }

  private static isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  private static estimatePurchaseCycle(customer: Customer): number {
    // Default purchase cycles by segment (in days)
    const defaultCycles = {
      'SME': 90,
      'LARGE_ENTERPRISE': 180,
      'B2B': 120,
      'B2C': 60
    };

    return defaultCycles[customer.customerSegment as keyof typeof defaultCycles] || 90;
  }

  private static estimateValueBySegment(segment: string): number {
    const segmentValues = {
      'SME': 25000,
      'LARGE_ENTERPRISE': 75000,
      'B2B': 35000,
      'B2C': 15000
    };

    return segmentValues[segment as keyof typeof segmentValues] || 25000;
  }

  private static determineUrgencyLevel(
    priorityScore: number, 
    tags: string[]
  ): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
    if (priorityScore >= 70 || tags.includes('TOP_CLIENT')) return 'CRITICAL';
    if (priorityScore >= 50 || tags.includes('VISITE_ANCIENNE')) return 'HIGH';
    if (priorityScore >= 30) return 'MEDIUM';
    return 'LOW';
  }

  // New methods for improved algorithm
  private static processPersistentRecommendations(
    persistentRecs: PersistentRecommendation[],
    recentCalls: CallRecord[],
    managerSettings?: ManagerAlertSettings
  ): {
    validPersistent: PersistentRecommendation[];
    updatedPersistent: PersistentRecommendation[];
    alerts: ManagerAlert[];
  } {
    const validPersistent: PersistentRecommendation[] = [];
    const updatedPersistentArray: PersistentRecommendation[] = [];
    const alerts: ManagerAlert[] = [];
    const today = new Date();

    // Check which persistent clients were contacted
    const contactedIds = new Set(
      recentCalls
        .filter(call => this.daysDifference(today, call.callDate) <= 1) // Called today
        .map(call => call.customerId)
    );

    persistentRecs.forEach(persistent => {
      const daysPersisted = this.daysDifference(today, persistent.firstRecommendedDate);
      
      // If client was contacted, remove from persistence
      if (contactedIds.has(persistent.customerId)) {
        return; // Don't add to any list - client was successfully contacted
      }

      // If exceeded persistence days, remove from list
      if (daysPersisted > this.PERSISTENCE_DAYS) {
        return; // Client drops out after 5 days
      }

      // Update persistence info
      const updatedPersistent = {
        ...persistent,
        daysPersisted,
        lastAttemptDate: today
      };

      validPersistent.push(updatedPersistent);
      updatedPersistentArray.push(updatedPersistent);

      // Check for manager alerts
      if (managerSettings?.enableAlerts && daysPersisted >= managerSettings.alertAfterDays) {
        const shouldAlert = this.shouldSendManagerAlert(updatedPersistent, managerSettings);
        
        if (shouldAlert && !updatedPersistent.managerNotified) {
          alerts.push({
            id: `alert-${persistent.customerId}-${Date.now()}`,
            type: updatedPersistent.urgencyLevel === 'CRITICAL' ? 'CRITICAL_MISSED' : 'PERSISTENT_CLIENT',
            customerId: persistent.customerId,
            customerName: persistent.customerName,
            message: `Client "${persistent.customerName}" non contacté depuis ${daysPersisted} jours (priorité: ${updatedPersistent.urgencyLevel})`,
            daysPersisted,
            urgencyLevel: updatedPersistent.urgencyLevel,
            estimatedValue: this.estimateValueBySegment('LARGE_ENTERPRISE'), // Default estimate
            createdAt: today,
            acknowledged: false
          });

          updatedPersistent.managerNotified = true;
        }
      }
    });

    return { validPersistent, updatedPersistent: updatedPersistentArray, alerts };
  }

  private static shouldSendManagerAlert(
    persistent: PersistentRecommendation,
    settings: ManagerAlertSettings
  ): boolean {
    const daysSinceFirstRecommended = this.daysDifference(new Date(), persistent.firstRecommendedDate);
    
    switch (settings.alertFrequency) {
      case 'DAILY':
        return daysSinceFirstRecommended >= settings.alertAfterDays;
      case 'EVERY_2_DAYS':
        return daysSinceFirstRecommended >= settings.alertAfterDays && 
               daysSinceFirstRecommended % 2 === 0;
      case 'WEEKLY':
        return daysSinceFirstRecommended >= settings.alertAfterDays && 
               daysSinceFirstRecommended % 7 === 0;
      default:
        return false;
    }
  }

  private static createPersistentRecommendation(
    persistent: PersistentRecommendation,
    customer: Customer & { visits: Visit[]; callPlans: CallPlan[] }
  ): PriorityCallRecommendation | null {
    // Add extra points for being persistent
    const basePriority = persistent.priority + this.WEIGHTS.PERSISTENT_CLIENT;
    
    const lastVisit = customer.visits
      .filter(v => v.actualDate)
      .sort((a, b) => (b.actualDate?.getTime() || 0) - (a.actualDate?.getTime() || 0))[0];

    const lastCall = customer.callPlans
      .filter(cp => cp.completedAt)
      .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))[0];

    const estimatedValue = customer.salesHistory || this.estimateValueBySegment(customer.customerSegment);

    return {
      id: `persistent-${persistent.customerId}-${Date.now()}`,
      customerId: persistent.customerId,
      customerName: persistent.customerName,
      priority: Math.round(basePriority),
      reason: `Client persistant (${persistent.daysPersisted} jours non contacté) • ${this.getPersistentReason(persistent)}`,
      lastVisit: lastVisit?.actualDate || undefined,
      lastCall: lastCall?.completedAt || undefined,
      lastPurchase: customer.lastPurchase || undefined,
      salesHistory: customer.salesHistory || undefined,
      segment: customer.customerSegment,
      location: customer.location || undefined,
      phone: customer.contactPhone || undefined,
      email: customer.contactEmail || undefined,
      estimatedValue,
      urgencyLevel: this.escalateUrgencyLevel(persistent.urgencyLevel, persistent.daysPersisted),
      tags: ['CLIENT_PERSISTANT', `JOUR_${persistent.daysPersisted}`, ...this.getPersistentTags(persistent)]
    };
  }

  private static getPersistentReason(persistent: PersistentRecommendation): string {
    if (persistent.urgencyLevel === 'CRITICAL') {
      return 'Client critique nécessitant attention immédiate';
    }
    if (persistent.daysPersisted >= 3) {
      return 'Risque de perte de client important';
    }
    return 'Suivi commercial prioritaire';
  }

  private static escalateUrgencyLevel(
    currentLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
    daysPersisted: number
  ): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
    if (daysPersisted >= 4) return 'CRITICAL';
    if (daysPersisted >= 2 && currentLevel !== 'CRITICAL') return 'HIGH';
    return currentLevel;
  }

  private static getPersistentTags(persistent: PersistentRecommendation): string[] {
    const tags = ['URGENCE_ESCALADÉE'];
    
    if (persistent.daysPersisted >= 4) tags.push('RISQUE_ÉLEVÉ');
    if (persistent.daysPersisted >= 2) tags.push('SUIVI_MANQUÉ');
    if (persistent.urgencyLevel === 'CRITICAL') tags.push('CLIENT_VIP');
    
    return tags;
  }

  // Database simulation methods for call recording
  static recordCall(callRecord: CallRecord): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate database save
      const existingCalls = JSON.parse(localStorage.getItem('priority-calls-db') || '[]');
      existingCalls.push({
        ...callRecord,
        id: `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        callDate: new Date().toISOString()
      });
      localStorage.setItem('priority-calls-db', JSON.stringify(existingCalls));
      
      console.log('Call recorded in database:', callRecord);
      resolve(true);
    });
  }

  static getRecentCalls(days: number = 30): Promise<CallRecord[]> {
    return new Promise((resolve) => {
      const calls = JSON.parse(localStorage.getItem('priority-calls-db') || '[]');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const recentCalls = calls
        .map((call: any) => ({
          ...call,
          callDate: new Date(call.callDate)
        }))
        .filter((call: CallRecord) => call.callDate >= cutoffDate);
      
      resolve(recentCalls);
    });
  }

  static getPersistentRecommendations(): Promise<PersistentRecommendation[]> {
    return new Promise((resolve) => {
      const persistent = JSON.parse(localStorage.getItem('persistent-recommendations') || '[]');
      resolve(persistent.map((p: any) => ({
        ...p,
        firstRecommendedDate: new Date(p.firstRecommendedDate),
        lastAttemptDate: p.lastAttemptDate ? new Date(p.lastAttemptDate) : undefined
      })));
    });
  }

  static savePersistentRecommendations(recommendations: PersistentRecommendation[]): Promise<boolean> {
    return new Promise((resolve) => {
      localStorage.setItem('persistent-recommendations', JSON.stringify(recommendations));
      resolve(true);
    });
  }
}

// Mock data generator for demo purposes
export function generateMockPriorityCallsData(count: number = 20): PriorityCallRecommendation[] {
  const mockRecommendations: PriorityCallRecommendation[] = [
    {
      id: 'rec-1',
      customerId: 'cust-1',
      customerName: 'Nestlé Suisse SA',
      priority: 95,
      reason: 'Client TOP 100 sans achat cette année • Dernière visite il y a 125 jours • Dernier appel il y a 45 jours',
      lastVisit: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      salesHistory: 125000,
      segment: 'LARGE_ENTERPRISE',
      location: 'Vevey, VD',
      phone: '+41 21 924 21 11',
      email: 'contact@nestle.ch',
      estimatedValue: 125000,
      urgencyLevel: 'CRITICAL',
      tags: ['TOP_CLIENT', 'AUCUN_ACHAT', 'VISITE_ANCIENNE']
    },
    {
      id: 'rec-2',
      customerId: 'cust-2',
      customerName: 'UBS Genève',
      priority: 88,
      reason: 'Client TOP 100 sans achat cette année • Dans l\'itinéraire des 10 prochains jours • Cycle d\'achat habituel approche',
      lastVisit: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 165 * 24 * 60 * 60 * 1000),
      salesHistory: 98000,
      segment: 'LARGE_ENTERPRISE',
      location: 'Genève, GE',
      phone: '+41 22 375 75 75',
      email: 'corporate@ubs.com',
      estimatedValue: 98000,
      urgencyLevel: 'CRITICAL',
      tags: ['TOP_CLIENT', 'AUCUN_ACHAT', 'ITINÉRAIRE_PRÉVU', 'CYCLE_ACHAT']
    },
    {
      id: 'rec-3',
      customerId: 'cust-3',
      customerName: 'Roche Pharmaceuticals',
      priority: 82,
      reason: 'Client TOP 100 sans achat cette année • Dernière visite il y a 95 jours • Dernier appel il y a 55 jours',
      lastVisit: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
      salesHistory: 87000,
      segment: 'LARGE_ENTERPRISE',
      location: 'Bâle, BS',
      phone: '+41 61 688 11 11',
      email: 'info@roche.com',
      estimatedValue: 87000,
      urgencyLevel: 'HIGH',
      tags: ['TOP_CLIENT', 'AUCUN_ACHAT', 'VISITE_ANCIENNE']
    },
    {
      id: 'rec-4',
      customerId: 'cust-4',
      customerName: 'Credit Suisse Zurich',
      priority: 78,
      reason: 'Client TOP 100 sans achat cette année • Dans l\'itinéraire des 10 prochains jours • Dernier appel il y a 35 jours',
      lastVisit: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 175 * 24 * 60 * 60 * 1000),
      salesHistory: 92000,
      segment: 'LARGE_ENTERPRISE',
      location: 'Zurich, ZH',
      phone: '+41 44 333 11 11',
      email: 'corporate@credit-suisse.com',
      estimatedValue: 92000,
      urgencyLevel: 'HIGH',
      tags: ['TOP_CLIENT', 'AUCUN_ACHAT', 'ITINÉRAIRE_PRÉVU']
    },
    {
      id: 'rec-5',
      customerId: 'cust-5',
      customerName: 'Swiss Re',
      priority: 75,
      reason: 'Dernière visite il y a 110 jours • Aucun appel enregistré • Cycle d\'achat habituel approche',
      lastVisit: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 155 * 24 * 60 * 60 * 1000),
      salesHistory: 65000,
      segment: 'LARGE_ENTERPRISE',
      location: 'Zurich, ZH',
      phone: '+41 43 285 21 21',
      email: 'corporate@swissre.com',
      estimatedValue: 65000,
      urgencyLevel: 'HIGH',
      tags: ['VISITE_ANCIENNE', 'JAMAIS_APPELÉ', 'CYCLE_ACHAT']
    },
    {
      id: 'rec-6',
      customerId: 'cust-6',
      customerName: 'Novartis International',
      priority: 72,
      reason: 'Client TOP 100 sans achat cette année • Dernier appel il y a 42 jours • Cycle d\'achat habituel approche',
      lastVisit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 190 * 24 * 60 * 60 * 1000),
      salesHistory: 78000,
      segment: 'LARGE_ENTERPRISE',
      location: 'Bâle, BS',
      phone: '+41 61 324 11 11',
      email: 'contact@novartis.com',
      estimatedValue: 78000,
      urgencyLevel: 'HIGH',
      tags: ['TOP_CLIENT', 'AUCUN_ACHAT', 'CYCLE_ACHAT']
    },
    {
      id: 'rec-7',
      customerId: 'cust-7',
      customerName: 'ABB Suisse',
      priority: 68,
      reason: 'Dernière visite il y a 88 jours • Dans l\'itinéraire des 10 prochains jours • Dernier appel il y a 28 jours',
      lastVisit: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000),
      salesHistory: 52000,
      segment: 'LARGE_ENTERPRISE',
      location: 'Baden, AG',
      phone: '+41 43 317 71 71',
      email: 'info@ch.abb.com',
      estimatedValue: 52000,
      urgencyLevel: 'MEDIUM',
      tags: ['VISITE_ANCIENNE', 'ITINÉRAIRE_PRÉVU']
    },
    {
      id: 'rec-8',
      customerId: 'cust-8',
      customerName: 'Migros Genève',
      priority: 65,
      reason: 'Aucune visite enregistrée • Dernier appel il y a 38 jours • Cycle d\'achat habituel approche',
      lastCall: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
      salesHistory: 35000,
      segment: 'SME',
      location: 'Genève, GE',
      phone: '+41 22 319 30 00',
      email: 'contact@migros-geneve.ch',
      estimatedValue: 35000,
      urgencyLevel: 'MEDIUM',
      tags: ['JAMAIS_VISITÉ', 'CYCLE_ACHAT']
    },
    {
      id: 'rec-9',
      customerId: 'cust-9',
      customerName: 'Swisscom Enterprise',
      priority: 62,
      reason: 'Dernière visite il y a 75 jours • Aucun appel enregistré • Dans l\'itinéraire des 10 prochains jours',
      lastVisit: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      salesHistory: 48000,
      segment: 'LARGE_ENTERPRISE',
      location: 'Berne, BE',
      phone: '+41 58 221 21 21',
      email: 'enterprise@swisscom.com',
      estimatedValue: 48000,
      urgencyLevel: 'MEDIUM',
      tags: ['VISITE_RÉCENTE', 'JAMAIS_APPELÉ', 'ITINÉRAIRE_PRÉVU']
    },
    {
      id: 'rec-10',
      customerId: 'cust-10',
      customerName: 'Zurich Insurance',
      priority: 58,
      reason: 'Dernière visite il y a 92 jours • Dernier appel il y a 48 jours • Cycle d\'achat habituel approche',
      lastVisit: new Date(Date.now() - 92 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 165 * 24 * 60 * 60 * 1000),
      salesHistory: 42000,
      segment: 'LARGE_ENTERPRISE',
      location: 'Zurich, ZH',
      phone: '+41 44 625 25 25',
      email: 'corporate@zurich.ch',
      estimatedValue: 42000,
      urgencyLevel: 'MEDIUM',
      tags: ['VISITE_ANCIENNE', 'CYCLE_ACHAT']
    },
    {
      id: 'rec-11',
      customerId: 'cust-11',
      customerName: 'Swatch Group',
      priority: 55,
      reason: 'Dernière visite il y a 65 jours • Dernier appel il y a 32 jours',
      lastVisit: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000),
      salesHistory: 28000,
      segment: 'SME',
      location: 'Bienne, BE',
      phone: '+41 32 343 68 11',
      email: 'info@swatchgroup.com',
      estimatedValue: 28000,
      urgencyLevel: 'MEDIUM',
      tags: ['VISITE_RÉCENTE']
    },
    {
      id: 'rec-12',
      customerId: 'cust-12',
      customerName: 'LafargeHolcim',
      priority: 52,
      reason: 'Aucune visite enregistrée • Aucun appel enregistré • Dans l\'itinéraire des 10 prochains jours',
      lastPurchase: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
      salesHistory: 32000,
      segment: 'SME',
      location: 'Rapperswil-Jona, SG',
      phone: '+41 58 858 86 00',
      email: 'info@lafargeholcim.com',
      estimatedValue: 32000,
      urgencyLevel: 'MEDIUM',
      tags: ['JAMAIS_VISITÉ', 'JAMAIS_APPELÉ', 'ITINÉRAIRE_PRÉVU']
    },
    {
      id: 'rec-13',
      customerId: 'cust-13',
      customerName: 'Adecco Group',
      priority: 48,
      reason: 'Dernière visite il y a 58 jours • Dernier appel il y a 25 jours',
      lastVisit: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
      salesHistory: 24000,
      segment: 'SME',
      location: 'Zurich, ZH',
      phone: '+41 44 878 88 88',
      email: 'corporate@adecco.com',
      estimatedValue: 24000,
      urgencyLevel: 'MEDIUM',
      tags: ['VISITE_RÉCENTE']
    },
    {
      id: 'rec-14',
      customerId: 'cust-14',
      customerName: 'SGS Genève',
      priority: 45,
      reason: 'Dernière visite il y a 82 jours • Cycle d\'achat habituel approche',
      lastVisit: new Date(Date.now() - 82 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
      salesHistory: 38000,
      segment: 'SME',
      location: 'Genève, GE',
      phone: '+41 22 739 91 11',
      email: 'info@sgs.com',
      estimatedValue: 38000,
      urgencyLevel: 'LOW',
      tags: ['VISITE_ANCIENNE', 'CYCLE_ACHAT']
    },
    {
      id: 'rec-15',
      customerId: 'cust-15',
      customerName: 'Givaudan',
      priority: 42,
      reason: 'Dernière visite il y a 72 jours • Dernier appel il y a 40 jours',
      lastVisit: new Date(Date.now() - 72 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000),
      salesHistory: 29000,
      segment: 'SME',
      location: 'Vernier, GE',
      phone: '+41 22 780 91 11',
      email: 'info@givaudan.com',
      estimatedValue: 29000,
      urgencyLevel: 'LOW',
      tags: ['VISITE_RÉCENTE']
    },
    {
      id: 'rec-16',
      customerId: 'cust-16',
      customerName: 'Schindler Suisse',
      priority: 38,
      reason: 'Dans l\'itinéraire des 10 prochains jours • Dernier appel il y a 22 jours',
      lastVisit: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000),
      salesHistory: 26000,
      segment: 'SME',
      location: 'Hergiswil, NW',
      phone: '+41 41 445 31 31',
      email: 'info@schindler.com',
      estimatedValue: 26000,
      urgencyLevel: 'LOW',
      tags: ['ITINÉRAIRE_PRÉVU']
    },
    {
      id: 'rec-17',
      customerId: 'cust-17',
      customerName: 'Kuehne + Nagel',
      priority: 35,
      reason: 'Aucune visite enregistrée • Dernier appel il y a 35 jours',
      lastCall: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      salesHistory: 22000,
      segment: 'SME',
      location: 'Schindellegi, SZ',
      phone: '+41 44 786 95 11',
      email: 'info@kuehne-nagel.com',
      estimatedValue: 22000,
      urgencyLevel: 'LOW',
      tags: ['JAMAIS_VISITÉ']
    },
    {
      id: 'rec-18',
      customerId: 'cust-18',
      customerName: 'Lonza Group',
      priority: 32,
      reason: 'Dernière visite il y a 55 jours • Cycle d\'achat habituel approche',
      lastVisit: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 82 * 24 * 60 * 60 * 1000),
      salesHistory: 31000,
      segment: 'SME',
      location: 'Bâle, BS',
      phone: '+41 61 316 81 11',
      email: 'info@lonza.com',
      estimatedValue: 31000,
      urgencyLevel: 'LOW',
      tags: ['VISITE_RÉCENTE', 'CYCLE_ACHAT']
    },
    {
      id: 'rec-19',
      customerId: 'cust-19',
      customerName: 'Barry Callebaut',
      priority: 28,
      reason: 'Dernier appel il y a 45 jours • Dans l\'itinéraire des 10 prochains jours',
      lastVisit: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
      salesHistory: 19000,
      segment: 'SME',
      location: 'Zurich, ZH',
      phone: '+41 43 204 04 04',
      email: 'info@barry-callebaut.com',
      estimatedValue: 19000,
      urgencyLevel: 'LOW',
      tags: ['ITINÉRAIRE_PRÉVU']
    },
    {
      id: 'rec-20',
      customerId: 'cust-20',
      customerName: 'Geberit International',
      priority: 25,
      reason: 'Dernière visite il y a 48 jours • Dernier appel il y a 28 jours',
      lastVisit: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000),
      lastCall: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      lastPurchase: new Date(Date.now() - 78 * 24 * 60 * 60 * 1000),
      salesHistory: 17500,
      segment: 'SME',
      location: 'Rapperswil-Jona, SG',
      phone: '+41 55 221 63 00',
      email: 'info@geberit.com',
      estimatedValue: 17500,
      urgencyLevel: 'LOW',
      tags: ['VISITE_RÉCENTE']
    }
  ];

  // Return only the requested number of recommendations
  return mockRecommendations.slice(0, Math.min(count, mockRecommendations.length));
}
