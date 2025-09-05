
// Mock data system for deployment without database dependencies
import { v4 as uuidv4 } from 'uuid';

// Enums y tipos para el sistema de datos mock
export type UserRole = 'SALES_REP' | 'MANAGER' | 'ADMIN';
export type CustomerSegment = 'SME' | 'LARGE_ENTERPRISE' | 'B2B' | 'B2C';
export type CustomerStatus = 'ACTIVE' | 'POTENTIAL' | 'INACTIVE' | 'LEAD';
export type OfferStatus = 'DRAFT' | 'SENT' | 'NEGOTIATION' | 'WON' | 'LOST' | 'EXPIRED';
export type VisitType = 'SALES_CALL' | 'FOLLOW_UP' | 'DEMO' | 'NEGOTIATION' | 'CONTRACT_SIGNING' | 'RELATIONSHIP';
export type VisitStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
export type AppointmentType = 'MEETING' | 'CALL' | 'PRESENTATION' | 'TRAINING' | 'CLIENT_VISIT' | 'INTERNAL';
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type AppointmentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// Types for Prospection Module
export type ProspectSource = 'WEB_SEARCH' | 'DIRECTORY' | 'REFERRAL' | 'SOCIAL_MEDIA' | 'EVENT';
export type ProspectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IntentSignal = 'JOB_POSTING' | 'FUNDING' | 'EXPANSION' | 'TECHNOLOGY_ADOPTION' | 'COMPETITOR_MENTION' | 'INDUSTRY_NEWS';

// Interfaces principales
export interface MockUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  territory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockCustomer {
  id: string;
  customerName: string;
  mainContact?: string;
  contactEmail?: string;
  contactPhone?: string;
  customerSegment: CustomerSegment;
  customerStatus: CustomerStatus;
  salesHistory: number;
  potentialGrowth: number;
  lastVisit?: string;
  lastPurchase?: string;
  activeOfferings?: string;
  mainCompetitor?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  commercialNotes?: string;
  priority: number;
  assignedUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockOffer {
  id: string;
  offerName: string;
  customerName: string;
  amount: number;
  currency: string;
  status: OfferStatus;
  probability: number;
  expectedClose?: string;
  description?: string;
  nextAction?: string;
  lastContact?: string;
  customerId: string;
  assignedUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockVisit {
  id: string;
  visitType: VisitType;
  status: VisitStatus;
  scheduledDate: string;
  actualDate?: string;
  duration?: number;
  location?: string;
  objective?: string;
  notes?: string;
  outcome?: string;
  nextSteps?: string;
  satisfaction?: number;
  customerId: string;
  assignedUserId: string;
  offerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockAppointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  isAllDay: boolean;
  type: AppointmentType;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  reminderMinutes: number;
  isRecurring: boolean;
  notes?: string;
  assignedUserId: string;
  customerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockProspect {
  id: string;
  companyName: string;
  mainContact?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  industry: string;
  companySize: string; // "1-10", "11-50", "51-200", "201-1000", "1000+"
  location: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  source: ProspectSource;
  priority: ProspectPriority;
  fitScore: number; // 0-100
  contactability: number; // 0-100
  intentSignals: IntentSignal[];
  evidences: string[]; // 2+ evidences explaining why this is a good prospect
  estimatedRevenue: number;
  notes?: string;
  discoveredAt: string;
  lastResearched: string;
  isConverted: boolean; // false = still prospect, true = became customer
  convertedAt?: string;
  assignedUserId?: string;
  createdAt: string;
  updatedAt: string;
}

// Datos mock base
const currentDate = new Date().toISOString();

export const mockUsers: MockUser[] = [
  {
    id: 'cmevym6140001pzulv86ez0zx',
    email: 'pierre@birdlogyc.com',
    name: 'Pierre Martin',
    firstName: 'Pierre',
    lastName: 'Martin',
    role: 'MANAGER',
    territory: 'Suisse Romande',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'cmevym6120000pzultnfb7d49',
    email: 'manager@birdlogyc.com',
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'MANAGER',
    territory: 'Suisse Romande',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'cmevym6160002pzulln8nonnp',
    email: 'marie@birdlogyc.com',
    name: 'Marie Dubois',
    firstName: 'Marie',
    lastName: 'Dubois',
    role: 'SALES_REP',
    territory: 'Lausanne',
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

export const mockCustomers: MockCustomer[] = [
  {
    id: 'cust_001',
    customerName: 'Acme Solutions SA',
    mainContact: 'Jean Dupont',
    contactEmail: 'jean.dupont@acme.ch',
    contactPhone: '+41 21 123 45 67',
    customerSegment: 'SME',
    customerStatus: 'ACTIVE',
    salesHistory: 125000,
    potentialGrowth: 75000,
    lastVisit: '2024-08-15T10:00:00Z',
    lastPurchase: '2024-07-20T14:30:00Z',
    activeOfferings: 'Software License, Support',
    mainCompetitor: 'TechCorp',
    location: 'Lausanne',
    latitude: 46.5197,
    longitude: 6.6323,
    commercialNotes: 'Cliente très intéressé par nos nouvelles solutions',
    priority: 1,
    assignedUserId: 'cmevym6160002pzulln8nonnp',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'cust_002',
    customerName: 'Swiss Innovation AG',
    mainContact: 'Anna Weber',
    contactEmail: 'a.weber@swissinno.ch',
    contactPhone: '+41 22 987 65 43',
    customerSegment: 'LARGE_ENTERPRISE',
    customerStatus: 'POTENTIAL',
    salesHistory: 0,
    potentialGrowth: 250000,
    location: 'Genève',
    latitude: 46.2044,
    longitude: 6.1432,
    commercialNotes: 'Prospect prometteur pour Q4 2024',
    priority: 2,
    assignedUserId: 'cmevym6140001pzulv86ez0zx',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'cust_003',
    customerName: 'TechStart Sàrl',
    mainContact: 'Marc Müller',
    contactEmail: 'marc@techstart.ch',
    contactPhone: '+41 31 555 12 34',
    customerSegment: 'B2B',
    customerStatus: 'LEAD',
    salesHistory: 0,
    potentialGrowth: 45000,
    location: 'Bern',
    latitude: 46.9481,
    longitude: 7.4474,
    commercialNotes: 'Premier contact établi, à suivre',
    priority: 3,
    assignedUserId: 'cmevym6160002pzulln8nonnp',
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

export const mockOffers: MockOffer[] = [
  {
    id: 'offer_001',
    offerName: 'Solution CRM Enterprise',
    customerName: 'Acme Solutions SA',
    amount: 85000,
    currency: 'CHF',
    status: 'NEGOTIATION',
    probability: 75,
    expectedClose: '2024-09-30T23:59:59Z',
    description: 'Implémentation complète CRM avec formation et support',
    nextAction: 'Présentation technique prévue la semaine prochaine',
    lastContact: '2024-08-25T15:30:00Z',
    customerId: 'cust_001',
    assignedUserId: 'cmevym6160002pzulln8nonnp',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'offer_002',
    offerName: 'Package Digital Transformation',
    customerName: 'Swiss Innovation AG',
    amount: 150000,
    currency: 'CHF',
    status: 'SENT',
    probability: 50,
    expectedClose: '2024-10-31T23:59:59Z',
    description: 'Solution complète de transformation digitale',
    nextAction: 'Attente retour client sur proposition',
    customerId: 'cust_002',
    assignedUserId: 'cmevym6140001pzulv86ez0zx',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'offer_003',
    offerName: 'Starter Package',
    customerName: 'TechStart Sàrl',
    amount: 25000,
    currency: 'CHF',
    status: 'DRAFT',
    probability: 30,
    expectedClose: '2024-11-15T23:59:59Z',
    description: 'Package de démarrage pour startup',
    customerId: 'cust_003',
    assignedUserId: 'cmevym6160002pzulln8nonnp',
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

export const mockVisits: MockVisit[] = [
  {
    id: 'visit_001',
    visitType: 'SALES_CALL',
    status: 'COMPLETED',
    scheduledDate: '2024-08-15T10:00:00Z',
    actualDate: '2024-08-15T10:15:00Z',
    duration: 90,
    location: 'Bureau client - Lausanne',
    objective: 'Présentation solution CRM et négociation contrat',
    notes: 'Réunion très productive. Client intéressé par toutes les fonctionnalités.',
    outcome: 'Accord de principe obtenu. Proposition technique à envoyer.',
    nextSteps: 'Envoyer proposition détaillée avant vendredi',
    satisfaction: 4,
    customerId: 'cust_001',
    assignedUserId: 'cmevym6160002pzulln8nonnp',
    offerId: 'offer_001',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'visit_002',
    visitType: 'DEMO',
    status: 'PLANNED',
    scheduledDate: '2024-09-05T14:00:00Z',
    location: 'Nos bureaux - Genève',
    objective: 'Démonstration produit et présentation ROI',
    notes: 'Préparer démonstration personnalisée selon besoins client',
    customerId: 'cust_002',
    assignedUserId: 'cmevym6140001pzulv86ez0zx',
    offerId: 'offer_002',
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

export const mockAppointments: MockAppointment[] = [
  {
    id: 'appt_001',
    title: 'Réunion équipe commerciale',
    description: 'Point mensuel sur les objectifs et stratégies',
    startTime: '2024-09-02T09:00:00Z',
    endTime: '2024-09-02T11:00:00Z',
    location: 'Salle de réunion A',
    isAllDay: false,
    type: 'MEETING',
    status: 'SCHEDULED',
    priority: 'HIGH',
    reminderMinutes: 15,
    isRecurring: true,
    notes: 'Préparer rapport mensuel',
    assignedUserId: 'cmevym6140001pzulv86ez0zx',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'appt_002',
    title: 'Visite client - Acme Solutions',
    description: 'Suivi post-vente et discussion nouveaux besoins',
    startTime: '2024-09-03T14:30:00Z',
    endTime: '2024-09-03T16:00:00Z',
    location: 'Lausanne - Bureau client',
    isAllDay: false,
    type: 'CLIENT_VISIT',
    status: 'CONFIRMED',
    priority: 'MEDIUM',
    reminderMinutes: 30,
    isRecurring: false,
    customerId: 'cust_001',
    assignedUserId: 'cmevym6160002pzulln8nonnp',
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

// Mock prospects data - Companies NOT in existing customer base
export const mockProspects: MockProspect[] = [
  {
    id: 'prospect_001',
    companyName: 'FinTech Zurich AG',
    mainContact: 'Thomas Schneider',
    contactEmail: 'thomas.schneider@fintech-zh.ch',
    contactPhone: '+41 44 123 45 67',
    website: 'https://fintech-zurich.ch',
    industry: 'Financial Technology',
    companySize: '51-200',
    location: 'Zurich',
    latitude: 47.3769,
    longitude: 8.5417,
    description: 'Startup fintech spécialisée dans les solutions de paiement digital pour PME suisses',
    source: 'WEB_SEARCH',
    priority: 'HIGH',
    fitScore: 85,
    contactability: 75,
    intentSignals: ['JOB_POSTING', 'FUNDING', 'TECHNOLOGY_ADOPTION'],
    evidences: [
      'Récente levée de fonds de 2.5M CHF selon StartupTicker.ch',
      'Publication de 3 offres d\'emploi tech sur LinkedIn dans les 30 derniers jours',
      'Mention dans TechCrunch Suisse comme "startup à suivre 2024"'
    ],
    estimatedRevenue: 120000,
    notes: 'CEO très actif sur LinkedIn, entreprise en pleine croissance',
    discoveredAt: '2024-08-25T09:00:00Z',
    lastResearched: '2024-08-30T14:30:00Z',
    isConverted: false,
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'prospect_002',
    companyName: 'Alpine Manufacturing Sàrl',
    mainContact: 'Isabelle Rochat',
    contactEmail: 'i.rochat@alpine-mfg.ch',
    contactPhone: '+41 26 987 65 43',
    website: 'https://alpine-manufacturing.ch',
    industry: 'Manufacturing',
    companySize: '201-1000',
    location: 'Fribourg',
    latitude: 46.8182,
    longitude: 7.1547,
    description: 'Fabricant de composants industriels cherchant à digitaliser ses processus',
    source: 'DIRECTORY',
    priority: 'HIGH',
    fitScore: 90,
    contactability: 80,
    intentSignals: ['EXPANSION', 'TECHNOLOGY_ADOPTION'],
    evidences: [
      'Annonce d\'ouverture d\'une nouvelle usine à Genève selon 24heures.ch',
      'Recherche active d\'un "Digital Transformation Manager" sur JobUp.ch',
      'Participation au salon Industry 4.0 Geneva comme exposant'
    ],
    estimatedRevenue: 200000,
    notes: 'Entreprise familiale en transition vers l\'industrie 4.0',
    discoveredAt: '2024-08-20T11:00:00Z',
    lastResearched: '2024-08-29T16:45:00Z',
    isConverted: false,
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'prospect_003',
    companyName: 'GreenEnergy Solutions SA',
    mainContact: 'Dr. Andreas Keller',
    contactEmail: 'a.keller@greenenergy-sol.ch',
    website: 'https://greenenergy-solutions.ch',
    industry: 'Renewable Energy',
    companySize: '11-50',
    location: 'Basel',
    latitude: 47.5596,
    longitude: 7.5886,
    description: 'Startup cleantech développant des solutions de stockage d\'énergie renouvelable',
    source: 'SOCIAL_MEDIA',
    priority: 'MEDIUM',
    fitScore: 70,
    contactability: 65,
    intentSignals: ['FUNDING', 'JOB_POSTING'],
    evidences: [
      'Subvention de 500K CHF reçue d\'Innosuisse selon communiqué de presse',
      'CEO Andreas Keller très actif sur LinkedIn avec 3000+ connexions',
      'Partenariat récent avec BKW selon Handelszeitung'
    ],
    estimatedRevenue: 80000,
    notes: 'Secteur en forte croissance, potentiel d\'expansion européenne',
    discoveredAt: '2024-08-22T13:30:00Z',
    lastResearched: '2024-08-28T10:15:00Z',
    isConverted: false,
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'prospect_004',
    companyName: 'Swiss Logistics Hub AG',
    mainContact: 'Elena Martinez',
    contactEmail: 'e.martinez@swisslogistics.ch',
    contactPhone: '+41 31 555 99 88',
    website: 'https://swiss-logistics-hub.ch',
    industry: 'Logistics & Supply Chain',
    companySize: '51-200',
    location: 'Bern',
    latitude: 46.9481,
    longitude: 7.4474,
    description: 'Plateforme logistique intégrée offrant services de stockage et distribution',
    source: 'REFERRAL',
    priority: 'HIGH',
    fitScore: 88,
    contactability: 85,
    intentSignals: ['EXPANSION', 'TECHNOLOGY_ADOPTION', 'COMPETITOR_MENTION'],
    evidences: [
      'Recommandation directe par client existant Acme Solutions SA',
      'Ouverture d\'un nouveau centre de distribution à Genève annoncée',
      'Recherche de solutions CRM selon leur responsable IT contacté',
      'Mention négative de leur concurrent principal sur leur site web'
    ],
    estimatedRevenue: 150000,
    notes: 'Référé par Acme Solutions - contact chaud, planning meeting ASAP',
    discoveredAt: '2024-08-26T08:00:00Z',
    lastResearched: '2024-08-30T09:30:00Z',
    isConverted: false,
    assignedUserId: 'cmevym6140001pzulv86ez0zx',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'prospect_005',
    companyName: 'Digital Health Innovation Sàrl',
    mainContact: 'Dr. Céline Dubois',
    contactEmail: 'c.dubois@dhi-swiss.ch',
    website: 'https://digital-health-innovation.ch',
    industry: 'Healthcare Technology',
    companySize: '11-50',
    location: 'Lausanne',
    latitude: 46.5197,
    longitude: 6.6323,
    description: 'Développement de solutions digitales pour hôpitaux et cliniques suisses',
    source: 'EVENT',
    priority: 'MEDIUM',
    fitScore: 75,
    contactability: 70,
    intentSignals: ['FUNDING', 'JOB_POSTING'],
    evidences: [
      'Présentation remarquée au Digital Health Summit Lausanne 2024',
      'Obtention du label "Swiss Digital Health Pioneer" par Digitalswitzerland',
      'Recrutement actif d\'un Business Development Manager selon AnnonceRomande'
    ],
    estimatedRevenue: 95000,
    notes: 'Secteur healthcare en pleine digitalisation, timing optimal',
    discoveredAt: '2024-08-24T16:20:00Z',
    lastResearched: '2024-08-29T11:45:00Z',
    isConverted: false,
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    id: 'prospect_006',
    companyName: 'RetailTech Connect AG',
    mainContact: 'Marco Bernasconi',
    contactEmail: 'm.bernasconi@retailtech.ch',
    contactPhone: '+41 91 444 77 88',
    website: 'https://retailtech-connect.ch',
    industry: 'Retail Technology',
    companySize: '1-10',
    location: 'Lugano',
    latitude: 46.0037,
    longitude: 8.9511,
    description: 'Solutions e-commerce et retail pour petites et moyennes entreprises du Tessin',
    source: 'WEB_SEARCH',
    priority: 'LOW',
    fitScore: 60,
    contactability: 55,
    intentSignals: ['COMPETITOR_MENTION'],
    evidences: [
      'Site web récemment modernisé avec nouvelles fonctionnalités',
      'Critique de solutions concurrentes sur leur blog tech'
    ],
    estimatedRevenue: 35000,
    notes: 'Marché tessinois intéressant, mais entreprise encore petite',
    discoveredAt: '2024-08-21T14:15:00Z',
    lastResearched: '2024-08-27T13:20:00Z',
    isConverted: false,
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

// Classe pour gérer les données mock
export class MockDataManager {
  private static instance: MockDataManager;
  private users: MockUser[] = [...mockUsers];
  private customers: MockCustomer[] = [...mockCustomers];
  private offers: MockOffer[] = [...mockOffers];
  private prospects: MockProspect[] = [...mockProspects];
  private visits: MockVisit[] = [...mockVisits];
  private appointments: MockAppointment[] = [...mockAppointments];

  private constructor() {}

  static getInstance(): MockDataManager {
    if (!MockDataManager.instance) {
      MockDataManager.instance = new MockDataManager();
    }
    return MockDataManager.instance;
  }

  // Méthodes pour les utilisateurs
  getUsers() {
    return this.users;
  }

  getUserById(id: string) {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email: string) {
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Méthodes pour les clients
  getCustomers() {
    return this.customers;
  }

  getCustomerById(id: string) {
    return this.customers.find(customer => customer.id === id);
  }

  getCustomersByUserId(userId: string) {
    return this.customers.filter(customer => customer.assignedUserId === userId);
  }

  // Méthodes pour les offres
  getOffers() {
    return this.offers;
  }

  getOfferById(id: string) {
    return this.offers.find(offer => offer.id === id);
  }

  getOffersByUserId(userId: string) {
    return this.offers.filter(offer => offer.assignedUserId === userId);
  }

  getOffersByCustomerId(customerId: string) {
    return this.offers.filter(offer => offer.customerId === customerId);
  }

  // Méthodes pour les visites
  getVisits() {
    return this.visits;
  }

  getVisitById(id: string) {
    return this.visits.find(visit => visit.id === id);
  }

  getVisitsByUserId(userId: string) {
    return this.visits.filter(visit => visit.assignedUserId === userId);
  }

  getVisitsByCustomerId(customerId: string) {
    return this.visits.filter(visit => visit.customerId === customerId);
  }

  // Méthodes pour les rendez-vous
  getAppointments() {
    return this.appointments;
  }

  getAppointmentById(id: string) {
    return this.appointments.find(appointment => appointment.id === id);
  }

  getAppointmentsByUserId(userId: string) {
    return this.appointments.filter(appointment => appointment.assignedUserId === userId);
  }

  getAppointmentsByDate(date: string, userId?: string) {
    const targetDate = new Date(date).toDateString();
    let filtered = this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.startTime).toDateString();
      return appointmentDate === targetDate;
    });

    if (userId) {
      filtered = filtered.filter(appointment => appointment.assignedUserId === userId);
    }

    return filtered;
  }

  // Méthodes de création (pour les formulaires)
  createCustomer(data: Partial<MockCustomer>) {
    const customer: MockCustomer = {
      id: uuidv4(),
      customerName: data.customerName || '',
      mainContact: data.mainContact,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      customerSegment: data.customerSegment || 'SME',
      customerStatus: data.customerStatus || 'LEAD',
      salesHistory: data.salesHistory || 0,
      potentialGrowth: data.potentialGrowth || 0,
      lastVisit: data.lastVisit,
      lastPurchase: data.lastPurchase,
      activeOfferings: data.activeOfferings,
      mainCompetitor: data.mainCompetitor,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      commercialNotes: data.commercialNotes,
      priority: data.priority || 0,
      assignedUserId: data.assignedUserId || this.users[0].id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.customers.push(customer);
    return customer;
  }

  createOffer(data: Partial<MockOffer>) {
    const offer: MockOffer = {
      id: uuidv4(),
      offerName: data.offerName || '',
      customerName: data.customerName || '',
      amount: data.amount || 0,
      currency: data.currency || 'CHF',
      status: data.status || 'DRAFT',
      probability: data.probability || 50,
      expectedClose: data.expectedClose,
      description: data.description,
      nextAction: data.nextAction,
      lastContact: data.lastContact,
      customerId: data.customerId || '',
      assignedUserId: data.assignedUserId || this.users[0].id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.offers.push(offer);
    return offer;
  }

  createVisit(data: Partial<MockVisit>) {
    const visit: MockVisit = {
      id: uuidv4(),
      visitType: data.visitType || 'SALES_CALL',
      status: data.status || 'PLANNED',
      scheduledDate: data.scheduledDate || new Date().toISOString(),
      actualDate: data.actualDate,
      duration: data.duration,
      location: data.location,
      objective: data.objective,
      notes: data.notes,
      outcome: data.outcome,
      nextSteps: data.nextSteps,
      satisfaction: data.satisfaction,
      customerId: data.customerId || '',
      assignedUserId: data.assignedUserId || this.users[0].id,
      offerId: data.offerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.visits.push(visit);
    return visit;
  }

  createAppointment(data: Partial<MockAppointment>) {
    const appointment: MockAppointment = {
      id: uuidv4(),
      title: data.title || '',
      description: data.description,
      startTime: data.startTime || new Date().toISOString(),
      endTime: data.endTime || new Date(Date.now() + 3600000).toISOString(),
      location: data.location,
      isAllDay: data.isAllDay || false,
      type: data.type || 'MEETING',
      status: data.status || 'SCHEDULED',
      priority: data.priority || 'MEDIUM',
      reminderMinutes: data.reminderMinutes || 15,
      isRecurring: data.isRecurring || false,
      notes: data.notes,
      assignedUserId: data.assignedUserId || this.users[0].id,
      customerId: data.customerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.appointments.push(appointment);
    return appointment;
  }

  // Méthodes de mise à jour
  updateCustomer(id: string, data: Partial<MockCustomer>) {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index !== -1) {
      this.customers[index] = {
        ...this.customers[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return this.customers[index];
    }
    return null;
  }

  updateOffer(id: string, data: Partial<MockOffer>) {
    const index = this.offers.findIndex(offer => offer.id === id);
    if (index !== -1) {
      this.offers[index] = {
        ...this.offers[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return this.offers[index];
    }
    return null;
  }

  updateVisit(id: string, data: Partial<MockVisit>) {
    const index = this.visits.findIndex(visit => visit.id === id);
    if (index !== -1) {
      this.visits[index] = {
        ...this.visits[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return this.visits[index];
    }
    return null;
  }

  updateAppointment(id: string, data: Partial<MockAppointment>) {
    const index = this.appointments.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
      this.appointments[index] = {
        ...this.appointments[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return this.appointments[index];
    }
    return null;
  }

  // Méthodes de suppression
  deleteCustomer(id: string) {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index !== -1) {
      const deleted = this.customers[index];
      this.customers.splice(index, 1);
      return deleted;
    }
    return null;
  }

  deleteOffer(id: string) {
    const index = this.offers.findIndex(offer => offer.id === id);
    if (index !== -1) {
      const deleted = this.offers[index];
      this.offers.splice(index, 1);
      return deleted;
    }
    return null;
  }

  deleteVisit(id: string) {
    const index = this.visits.findIndex(visit => visit.id === id);
    if (index !== -1) {
      const deleted = this.visits[index];
      this.visits.splice(index, 1);
      return deleted;
    }
    return null;
  }

  deleteAppointment(id: string) {
    const index = this.appointments.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
      const deleted = this.appointments[index];
      this.appointments.splice(index, 1);
      return deleted;
    }
    return null;
  }

  // === PROSPECTS MANAGEMENT METHODS ===

  // Get all prospects
  getProspects(): MockProspect[] {
    return [...this.prospects];
  }

  // Get all customers (for uniqueness verification)
  getAllCustomers(): MockCustomer[] {
    return [...this.customers];
  }

  // Get all prospects (alias for consistency)
  getAllProspects(): MockProspect[] {
    return [...this.prospects];
  }

  // Get prospect by ID
  getProspectById(id: string): MockProspect | null {
    return this.prospects.find(prospect => prospect.id === id) || null;
  }

  // Search prospects with filters
  searchProspects(filters: {
    industry?: string;
    location?: string;
    companySize?: string;
    priority?: ProspectPriority;
    minFitScore?: number;
    maxFitScore?: number;
    source?: ProspectSource;
    intentSignals?: IntentSignal[];
  }): MockProspect[] {
    return this.prospects.filter(prospect => {
      if (prospect.isConverted) return false; // Only active prospects
      
      if (filters.industry && !prospect.industry.toLowerCase().includes(filters.industry.toLowerCase())) {
        return false;
      }
      if (filters.location && !prospect.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.companySize && prospect.companySize !== filters.companySize) {
        return false;
      }
      if (filters.priority && prospect.priority !== filters.priority) {
        return false;
      }
      if (filters.minFitScore && prospect.fitScore < filters.minFitScore) {
        return false;
      }
      if (filters.maxFitScore && prospect.fitScore > filters.maxFitScore) {
        return false;
      }
      if (filters.source && prospect.source !== filters.source) {
        return false;
      }
      if (filters.intentSignals && filters.intentSignals.length > 0) {
        const hasSignal = filters.intentSignals.some(signal => 
          prospect.intentSignals.includes(signal)
        );
        if (!hasSignal) return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by priority then fit score
      const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      return b.fitScore - a.fitScore;
    });
  }

  // Deduplicate prospect against existing customers
  deduplicateProspect(prospect: Partial<MockProspect>): boolean {
    const existingCustomer = this.customers.find(customer => 
      customer.customerName.toLowerCase() === prospect.companyName?.toLowerCase() ||
      customer.contactEmail?.toLowerCase() === prospect.contactEmail?.toLowerCase()
    );
    return !existingCustomer; // true if no duplicate found
  }

  // Convert prospect to customer
  convertProspectToCustomer(prospectId: string): MockCustomer | null {
    const prospect = this.getProspectById(prospectId);
    if (!prospect || prospect.isConverted) return null;

    // Mark prospect as converted
    prospect.isConverted = true;
    prospect.convertedAt = new Date().toISOString();
    prospect.updatedAt = new Date().toISOString();

    // Create new customer from prospect
    const newCustomer: MockCustomer = {
      id: `cust_${Date.now()}`,
      customerName: prospect.companyName,
      mainContact: prospect.mainContact,
      contactEmail: prospect.contactEmail,
      contactPhone: prospect.contactPhone,
      customerSegment: 'B2B', // Default for converted prospects
      customerStatus: 'LEAD',
      salesHistory: 0,
      potentialGrowth: prospect.estimatedRevenue,
      location: prospect.location,
      latitude: prospect.latitude,
      longitude: prospect.longitude,
      commercialNotes: `Converti depuis prospect: ${prospect.notes || ''}`,
      priority: prospect.priority === 'CRITICAL' ? 1 : prospect.priority === 'HIGH' ? 2 : 3,
      assignedUserId: prospect.assignedUserId || 'cmevym6140001pzulv86ez0zx',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.customers.push(newCustomer);
    return newCustomer;
  }

  // Add new prospect
  addProspect(prospectData: Omit<MockProspect, 'id' | 'createdAt' | 'updatedAt'>): MockProspect {
    const newProspect: MockProspect = {
      ...prospectData,
      id: `prospect_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.prospects.push(newProspect);
    return newProspect;
  }

  // Update prospect
  updateProspect(id: string, updates: Partial<MockProspect>): MockProspect | null {
    const index = this.prospects.findIndex(prospect => prospect.id === id);
    if (index !== -1) {
      this.prospects[index] = {
        ...this.prospects[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return this.prospects[index];
    }
    return null;
  }

  // Delete prospect
  deleteProspect(id: string): MockProspect | null {
    const index = this.prospects.findIndex(prospect => prospect.id === id);
    if (index !== -1) {
      const deleted = this.prospects[index];
      this.prospects.splice(index, 1);
      return deleted;
    }
    return null;
  }

  // Get prospects by priority
  getProspectsByPriority(priority: ProspectPriority): MockProspect[] {
    return this.prospects
      .filter(prospect => prospect.priority === priority && !prospect.isConverted)
      .sort((a, b) => b.fitScore - a.fitScore);
  }

  // Get prospects statistics
  getProspectsStats() {
    const activeProspects = this.prospects.filter(p => !p.isConverted);
    const totalEstimatedRevenue = activeProspects.reduce((sum, p) => sum + p.estimatedRevenue, 0);
    const avgFitScore = activeProspects.length > 0 
      ? activeProspects.reduce((sum, p) => sum + p.fitScore, 0) / activeProspects.length 
      : 0;
    
    return {
      totalProspects: activeProspects.length,
      totalEstimatedRevenue,
      avgFitScore: Math.round(avgFitScore),
      byPriority: {
        CRITICAL: activeProspects.filter(p => p.priority === 'CRITICAL').length,
        HIGH: activeProspects.filter(p => p.priority === 'HIGH').length,
        MEDIUM: activeProspects.filter(p => p.priority === 'MEDIUM').length,
        LOW: activeProspects.filter(p => p.priority === 'LOW').length,
      },
      bySource: {
        WEB_SEARCH: activeProspects.filter(p => p.source === 'WEB_SEARCH').length,
        DIRECTORY: activeProspects.filter(p => p.source === 'DIRECTORY').length,
        REFERRAL: activeProspects.filter(p => p.source === 'REFERRAL').length,
        SOCIAL_MEDIA: activeProspects.filter(p => p.source === 'SOCIAL_MEDIA').length,
        EVENT: activeProspects.filter(p => p.source === 'EVENT').length,
      }
    };
  }
}

// Export par défaut
export default MockDataManager;
