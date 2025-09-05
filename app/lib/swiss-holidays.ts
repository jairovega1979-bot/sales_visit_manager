
/**
 * Utilitaire pour gérer les jours fériés suisses
 * Basé sur les jours fériés officiels et cantonaux
 */

export interface SwissHoliday {
  name: string;
  date: Date;
  type: 'federal' | 'cantonal' | 'religious';
  cantons?: string[];
  description?: string;
}

/**
 * Calcule la date de Pâques pour une année donnée (algorithme de Gauss)
 */
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = Math.floor((h + l - 7 * m + 114) / 31);
  const p = (h + l - 7 * m + 114) % 31;
  
  return new Date(year, n - 1, p + 1);
}

/**
 * Génère tous les jours fériés pour une année donnée
 */
export function getSwissHolidays(year: number): SwissHoliday[] {
  const holidays: SwissHoliday[] = [];
  const easter = getEasterDate(year);

  // Jours fériés fixes
  holidays.push(
    {
      name: "Nouvel An",
      date: new Date(year, 0, 1),
      type: 'federal',
      description: "Jour de l'An - férié dans toute la Suisse"
    },
    {
      name: "Berchtoldstag",
      date: new Date(year, 0, 2),
      type: 'cantonal',
      cantons: ['BE', 'JU', 'NE', 'SH', 'TG', 'VD', 'ZH'],
      description: "2 janvier - férié dans certains cantons"
    },
    {
      name: "Épiphanie",
      date: new Date(year, 0, 6),
      type: 'cantonal',
      cantons: ['SZ', 'TI', 'UR'],
      description: "Jour des Rois - férié dans certains cantons"
    },
    {
      name: "Fête du Travail",
      date: new Date(year, 4, 1),
      type: 'cantonal',
      cantons: ['BL', 'BS', 'JU', 'NE', 'SH', 'TG', 'TI', 'ZH'],
      description: "1er mai - férié dans certains cantons"
    },
    {
      name: "Fête nationale",
      date: new Date(year, 7, 1),
      type: 'federal',
      description: "Fête nationale suisse - férié dans toute la Suisse"
    },
    {
      name: "Assomption",
      date: new Date(year, 7, 15),
      type: 'cantonal',
      cantons: ['AG', 'AI', 'FR', 'JU', 'LU', 'NW', 'OW', 'SO', 'SZ', 'TI', 'UR', 'VS', 'ZG'],
      description: "15 août - férié dans certains cantons"
    },
    {
      name: "Jeûne fédéral",
      date: new Date(year, 8, 15 + (7 - new Date(year, 8, 15).getDay()) % 7), // 3e dimanche de septembre
      type: 'cantonal',
      cantons: ['BE', 'BS', 'JU', 'NE', 'SH', 'TG', 'VD', 'ZH'],
      description: "Jeûne fédéral - 3e dimanche de septembre"
    },
    {
      name: "Toussaint",
      date: new Date(year, 10, 1),
      type: 'cantonal',
      cantons: ['AI', 'FR', 'GL', 'JU', 'LU', 'NW', 'OW', 'SG', 'SO', 'SZ', 'TI', 'UR', 'VS', 'ZG'],
      description: "1er novembre - férié dans certains cantons"
    },
    {
      name: "Immaculée Conception",
      date: new Date(year, 11, 8),
      type: 'cantonal',
      cantons: ['AI', 'FR', 'LU', 'NW', 'OW', 'SZ', 'TI', 'UR', 'VS', 'ZG'],
      description: "8 décembre - férié dans certains cantons"
    },
    {
      name: "Noël",
      date: new Date(year, 11, 25),
      type: 'federal',
      description: "Noël - férié dans toute la Suisse"
    },
    {
      name: "Saint-Étienne",
      date: new Date(year, 11, 26),
      type: 'cantonal',
      cantons: ['AG', 'AI', 'AR', 'BL', 'BS', 'BE', 'FR', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'ZG', 'ZH'],
      description: "26 décembre - férié dans la plupart des cantons"
    }
  );

  // Jours fériés mobiles basés sur Pâques
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);

  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);

  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);

  const whitMonday = new Date(easter);
  whitMonday.setDate(easter.getDate() + 50);

  holidays.push(
    {
      name: "Vendredi Saint",
      date: goodFriday,
      type: 'federal',
      description: "Vendredi Saint - férié dans toute la Suisse"
    },
    {
      name: "Pâques",
      date: easter,
      type: 'religious',
      description: "Dimanche de Pâques"
    },
    {
      name: "Lundi de Pâques",
      date: easterMonday,
      type: 'cantonal',
      cantons: ['BE', 'BL', 'BS', 'JU', 'NE', 'SH', 'TG', 'VD', 'ZH'],
      description: "Lundi de Pâques - férié dans certains cantons"
    },
    {
      name: "Ascension",
      date: ascension,
      type: 'federal',
      description: "Ascension - férié dans toute la Suisse"
    },
    {
      name: "Lundi de Pentecôte",
      date: whitMonday,
      type: 'federal',
      description: "Lundi de Pentecôte - férié dans toute la Suisse"
    }
  );

  // Trier par date
  return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Vérifie si une date donnée est un jour férié
 */
export function isSwissHoliday(date: Date, canton?: string): SwissHoliday | null {
  const year = date.getFullYear();
  const holidays = getSwissHolidays(year);
  
  return holidays.find(holiday => {
    const isSameDate = holiday.date.toDateString() === date.toDateString();
    
    if (!isSameDate) return false;
    
    // Si c'est un jour férié fédéral, il s'applique partout
    if (holiday.type === 'federal') return true;
    
    // Si un canton est spécifié, vérifier s'il est dans la liste
    if (canton && holiday.cantons) {
      return holiday.cantons.includes(canton);
    }
    
    // Par défaut, inclure tous les jours fériés
    return true;
  }) || null;
}

/**
 * Génère les jours fériés pour une plage de dates
 */
export function getHolidaysInRange(startDate: Date, endDate: Date, canton?: string): SwissHoliday[] {
  const holidays: SwissHoliday[] = [];
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  
  for (let year = startYear; year <= endYear; year++) {
    const yearHolidays = getSwissHolidays(year).filter(holiday => {
      const holidayTime = holiday.date.getTime();
      const inRange = holidayTime >= startDate.getTime() && holidayTime <= endDate.getTime();
      
      if (!inRange) return false;
      
      // Filtrer par canton si spécifié
      if (canton && holiday.type === 'cantonal' && holiday.cantons) {
        return holiday.cantons.includes(canton);
      }
      
      return holiday.type === 'federal' || holiday.type === 'religious' || !canton;
    });
    
    holidays.push(...yearHolidays);
  }
  
  return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Obtient les jours fériés du mois courant
 */
export function getCurrentMonthHolidays(canton?: string): SwissHoliday[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return getHolidaysInRange(startOfMonth, endOfMonth, canton);
}

/**
 * Liste des cantons suisses avec leurs codes
 */
export const SWISS_CANTONS = {
  'AG': 'Argovie',
  'AI': 'Appenzell Rhodes-Intérieures',
  'AR': 'Appenzell Rhodes-Extérieures',
  'BE': 'Berne',
  'BL': 'Bâle-Campagne',
  'BS': 'Bâle-Ville',
  'FR': 'Fribourg',
  'GE': 'Genève',
  'GL': 'Glaris',
  'GR': 'Grisons',
  'JU': 'Jura',
  'LU': 'Lucerne',
  'NE': 'Neuchâtel',
  'NW': 'Nidwald',
  'OW': 'Obwald',
  'SG': 'Saint-Gall',
  'SH': 'Schaffhouse',
  'SO': 'Soleure',
  'SZ': 'Schwyz',
  'TG': 'Thurgovie',
  'TI': 'Tessin',
  'UR': 'Uri',
  'VD': 'Vaud',
  'VS': 'Valais',
  'ZG': 'Zoug',
  'ZH': 'Zurich'
} as const;

export type SwissCanton = keyof typeof SWISS_CANTONS;
