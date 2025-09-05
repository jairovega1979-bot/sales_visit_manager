


import { NextRequest, NextResponse } from 'next/server';
import { demoState } from '@/lib/demo-state';
import { ProspectPriority, IntentSignal } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

// POST /api/prospects/search - Recherche manuelle de prospects par secteur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      sector,
      cantons = [],
      limit = 5,
      aiSearch = false,
      query,
      filters = {},
      sortBy = 'fitScore',
      sortOrder = 'desc'
    } = body;

    const manager = demoState.getManager();

    // If this is an AI search request
    if (aiSearch && sector && cantons.length > 0) {
      // Get existing customers to avoid duplicates
      const existingCustomers = manager.getAllCustomers();
      const existingProspects = manager.getAllProspects();
      
      // Generate new prospects for the sector and cantons
      const newProspectsData = generateAIProspectsForSectorAndCantons(
        sector, 
        cantons, 
        limit,
        existingCustomers,
        existingProspects
      );
      
      // Verify uniqueness - don't add to main prospects list, just return discovered ones
      return NextResponse.json({
        prospects: newProspectsData,
        count: newProspectsData.length,
        sector,
        cantons,
        searchSummary: {
          sector,
          cantonsSearched: cantons.map((code: string) => {
            const cantonNames: Record<string, string> = {
              'ZH': 'Zurich', 'BE': 'Berne', 'LU': 'Lucerne', 'UR': 'Uri', 'SZ': 'Schwyz',
              'OW': 'Obwald', 'NW': 'Nidwald', 'GL': 'Glaris', 'ZG': 'Zoug', 'FR': 'Fribourg',
              'SO': 'Soleure', 'BS': 'Bâle-Ville', 'BL': 'Bâle-Campagne', 'SH': 'Schaffhouse',
              'AR': 'Appenzell R.E.', 'AI': 'Appenzell R.I.', 'SG': 'Saint-Gall', 'GR': 'Grisons',
              'AG': 'Argovie', 'TG': 'Thurgovie', 'TI': 'Tessin', 'VD': 'Vaud', 'VS': 'Valais',
              'NE': 'Neuchâtel', 'GE': 'Genève', 'JU': 'Jura'
            };
            return { code, name: cantonNames[code] || code };
          }),
          totalProspects: newProspectsData.length,
          averageFitScore: Math.round(newProspectsData.reduce((sum, p) => sum + p.fitScore, 0) / newProspectsData.length)
        },
        message: `L'IA a découvert ${newProspectsData.length} entreprises "${sector}" uniques dans les cantons: ${cantons.join(', ')}`
      });
    }

    // Legacy manual search (for backward compatibility)
    if (sector && !aiSearch) {
      const newProspectsData = generateProspectsForSector(sector, limit);
      
      // Add to the demo state and collect the created prospects
      const addedProspects = newProspectsData.map(prospectData => 
        manager.addProspect(prospectData)
      );
      
      return NextResponse.json({
        prospects: addedProspects,
        count: addedProspects.length,
        sector,
        message: `Recherche terminée pour le secteur "${sector}"`
      });
    }

    // Otherwise, perform regular search
    let prospects = manager.searchProspects(filters);

    // Apply text search if query provided
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      prospects = prospects.filter(prospect => 
        prospect.companyName.toLowerCase().includes(searchTerm) ||
        prospect.industry.toLowerCase().includes(searchTerm) ||
        prospect.location.toLowerCase().includes(searchTerm) ||
        prospect.mainContact?.toLowerCase().includes(searchTerm) ||
        prospect.description?.toLowerCase().includes(searchTerm) ||
        prospect.notes?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    prospects.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'fitScore':
          aVal = a.fitScore;
          bVal = b.fitScore;
          break;
        case 'contactability':
          aVal = a.contactability;
          bVal = b.contactability;
          break;
        case 'estimatedRevenue':
          aVal = a.estimatedRevenue;
          bVal = b.estimatedRevenue;
          break;
        case 'discoveredAt':
          aVal = new Date(a.discoveredAt).getTime();
          bVal = new Date(b.discoveredAt).getTime();
          break;
        case 'companyName':
          aVal = a.companyName.toLowerCase();
          bVal = b.companyName.toLowerCase();
          break;
        default:
          aVal = a.fitScore;
          bVal = b.fitScore;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    const stats = manager.getProspectsStats();

    return NextResponse.json({
      prospects,
      count: prospects.length,
      query,
      filters,
      stats
    });
  } catch (error) {
    console.error('Erreur lors de la recherche de prospects:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche de prospects' },
      { status: 500 }
    );
  }
}

// Helper function to generate AI prospects for sector and cantons with uniqueness verification
function generateAIProspectsForSectorAndCantons(
  sector: string, 
  cantons: string[], 
  limit: number = 5, 
  existingCustomers: any[] = [], 
  existingProspects: any[] = []
) {
  const prospects = [];
  const existingNames = new Set([
    ...existingCustomers.map(c => c.customerName.toLowerCase()),
    ...existingProspects.map(p => p.companyName.toLowerCase())
  ]);

  // Cantones mapping
  const cantonNames: Record<string, string> = {
    'ZH': 'Zurich', 'BE': 'Berne', 'LU': 'Lucerne', 'UR': 'Uri', 'SZ': 'Schwyz',
    'OW': 'Obwald', 'NW': 'Nidwald', 'GL': 'Glaris', 'ZG': 'Zoug', 'FR': 'Fribourg',
    'SO': 'Soleure', 'BS': 'Bâle-Ville', 'BL': 'Bâle-Campagne', 'SH': 'Schaffhouse',
    'AR': 'Appenzell R.E.', 'AI': 'Appenzell R.I.', 'SG': 'Saint-Gall', 'GR': 'Grisons',
    'AG': 'Argovie', 'TG': 'Thurgovie', 'TI': 'Tessin', 'VD': 'Vaud', 'VS': 'Valais',
    'NE': 'Neuchâtel', 'GE': 'Genève', 'JU': 'Jura'
  };

  const sectorData = getAISectorData(sector);
  let companyIndex = 0;

  for (let i = 0; i < limit && companyIndex < sectorData.companies.length * 3; i++) {
    const selectedCanton = cantons[i % cantons.length];
    const cantonCity = cantonNames[selectedCanton];
    
    let companyName = '';
    let attempts = 0;
    
    // Find a unique company name
    do {
      const baseCompany = sectorData.companies[companyIndex % sectorData.companies.length];
      const cantonSuffix = selectedCanton;
      companyName = `${baseCompany.baseName} ${cantonSuffix}`;
      companyIndex++;
      attempts++;
    } while (existingNames.has(companyName.toLowerCase()) && attempts < 20);

    // If we couldn't find a unique name after 20 attempts, modify it
    if (existingNames.has(companyName.toLowerCase())) {
      companyName = `${companyName} ${Date.now().toString().slice(-3)}`;
    }

    const prospect = {
      companyName,
      industry: sector,
      location: cantonCity,
      companySize: getRandomCompanySize(),
      fitScore: Math.floor(Math.random() * 20) + 75, // High fit scores (75-95)
      contactability: Math.floor(Math.random() * 15) + 85, // High contactability (85-100)
      estimatedRevenue: Math.floor(Math.random() * 100000) + 30000, // 30k-130k CHF
      mainContact: sectorData.companies[i % sectorData.companies.length].contacts[Math.floor(Math.random() * 3)],
      contactEmail: generateEmail(companyName),
      priority: 'HIGH' as ProspectPriority, // AI discovered prospects are high priority
      source: 'WEB_SEARCH' as const,
      discoveredAt: new Date().toISOString(),
      lastResearched: new Date().toISOString(),
      isConverted: false,
      description: sectorData.companies[i % sectorData.companies.length].description.replace('{canton}', cantonCity),
      website: generateWebsite(companyName),
      intentSignals: getRandomIntentSignals(),
      evidences: sectorData.companies[i % sectorData.companies.length].evidences,
      notes: `Découvert par l'IA via recherche internet dans le secteur "${sector}" - Canton: ${cantonCity}`
    };
    
    prospects.push(prospect);
    existingNames.add(companyName.toLowerCase());
  }
  
  return prospects;
}

// Helper function to generate prospects for a specific sector
function generateProspectsForSector(sector: string, limit: number = 5) {
  const sectorData = getSectorData(sector);
  const prospects = [];
  
  for (let i = 0; i < limit; i++) {
    const companyData = sectorData.companies[i % sectorData.companies.length];
    const prospectData = {
      companyName: companyData.name,
      industry: sector,
      location: getRandomLocation(),
      companySize: getRandomCompanySize(),
      fitScore: Math.floor(Math.random() * 30) + 70, // High fit scores for manual searches
      contactability: Math.floor(Math.random() * 20) + 80,
      estimatedRevenue: Math.floor(Math.random() * 80000) + 20000,
      mainContact: companyData.contact,
      contactEmail: companyData.email,
      priority: getRandomPriority(),
      source: 'WEB_SEARCH' as const,
      discoveredAt: new Date().toISOString(),
      lastResearched: new Date().toISOString(),
      isConverted: false,
      description: companyData.description,
      website: companyData.website,
      intentSignals: getRandomIntentSignals(),
      evidences: companyData.evidences,
      notes: `Découvert via recherche manuelle dans le secteur "${sector}"`
    };
    prospects.push(prospectData);
  }
  
  return prospects;
}

// Helper functions for AI prospect generation
function generateEmail(companyName: string): string {
  const cleanName = companyName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15);
  const domains = ['gmail.com', 'bluewin.ch', 'sunrise.ch', 'swisscom.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `contact@${cleanName}.ch`;
}

function generateWebsite(companyName: string): string {
  const cleanName = companyName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15);
  return `https://${cleanName}.ch`;
}

function getAISectorData(sector: string) {
  const sectorLower = sector.toLowerCase();
  
  if (sectorLower.includes('technologie') || sectorLower.includes('tech') || sectorLower.includes('digital')) {
    return {
      companies: [
        {
          baseName: 'InnovaTech Solutions',
          contacts: ['Marc Dubois', 'Sarah Müller', 'Luca Rossi'],
          description: 'Développement de solutions digitales innovantes pour entreprises en {canton}.',
          evidences: ['Expansion équipe R&D', 'Nouveau contrat cantonal', 'Certification ISO 27001']
        },
        {
          baseName: 'SwissCode Pro',
          contacts: ['Anna Weber', 'Pierre Martin', 'Elena Fontana'],
          description: 'Solutions logicielles sur mesure pour PME de {canton}.',
          evidences: ['Partenariat université locale', 'Levée de fonds récente', 'Équipe technique doublée']
        },
        {
          baseName: 'Digital Alpine',
          contacts: ['Thomas Keller', 'Maria Gonzalez', 'Jean Rousseau'],
          description: 'Transformation digitale et consulting IT basé à {canton}.',
          evidences: ['Nouveau bureau ouvert', 'Certification Cloud', 'Croissance 40% annuelle']
        },
        {
          baseName: 'TechVision',
          contacts: ['Sophie Laurent', 'Marco Bianchi', 'Claire Dubois'],
          description: 'Intelligence artificielle et analyse de données pour entreprises de {canton}.',
          evidences: ['Contrat IA gouvernemental', 'Brevet algorithme', 'Expansion européenne']
        },
        {
          baseName: 'SwissIT Consulting',
          contacts: ['David Chen', 'Laura Schmidt', 'Paolo Verdi'],
          description: 'Consulting en transformation numérique pour le canton de {canton}.',
          evidences: ['Partenariat Microsoft', 'Nouveau service cloud', 'Équipe internationale']
        }
      ]
    };
  }
  
  if (sectorLower.includes('finance') || sectorLower.includes('banque') || sectorLower.includes('assurance')) {
    return {
      companies: [
        {
          baseName: 'Wealth Partners',
          contacts: ['Philippe Rousseau', 'Anna Weber', 'Marc Fontana'],
          description: 'Gestion de patrimoine privé pour clients fortunés de {canton}.',
          evidences: ['Nouveau produit crypto', 'Licence bancaire', 'Actifs +25%']
        },
        {
          baseName: 'FinTech Solutions',
          contacts: ['Sarah Mueller', 'Luca Rossi', 'Elena Martin'],
          description: 'Solutions fintech innovantes pour institutions de {canton}.',
          evidences: ['Licence FINMA', 'API bancaire', 'Partenariat UBS']
        },
        {
          baseName: 'Insurance Plus',
          contacts: ['Thomas Weber', 'Maria Keller', 'Jean Dubois'],
          description: 'Assurances innovantes et produits financiers pour {canton}.',
          evidences: ['Nouveau produit vie', 'Croissance primes', 'Digitalisation complète']
        }
      ]
    };
  }
  
  if (sectorLower.includes('santé') || sectorLower.includes('médical') || sectorLower.includes('pharmacie')) {
    return {
      companies: [
        {
          baseName: 'MedTech Innovations',
          contacts: ['Dr. Elena Rossi', 'Dr. Marc Weber', 'Dr. Sarah Keller'],
          description: 'Équipements médicaux innovants développés en {canton}.',
          evidences: ['Brevet FDA approuvé', 'Essais cliniques', 'Hôpital partenaire']
        },
        {
          baseName: 'Health Analytics',
          contacts: ['Thomas Chen', 'Laura Fontana', 'Paolo Mueller'],
          description: 'Solutions IA pour le secteur médical en {canton}.',
          evidences: ['IA diagnostique', 'Contrat assurance', 'Expansion européenne']
        },
        {
          baseName: 'Pharma Research',
          contacts: ['Dr. Claire Laurent', 'Dr. Marco Dubois', 'Dr. Sophie Weber'],
          description: 'Recherche pharmaceutique et développement de médicaments en {canton}.',
          evidences: ['Nouveau médicament', 'Essais phase 3', 'Autorisation Swissmedic']
        }
      ]
    };
  }
  
  // Default for other sectors
  return {
    companies: [
      {
        baseName: `${sector} Excellence`,
        contacts: ['Jean-Pierre Martin', 'Maria Gonzalez', 'Thomas Müller'],
        description: `Entreprise leader dans le secteur ${sector} en {canton}.`,
        evidences: ['Expansion internationale', 'Nouveaux investissements', 'Croissance soutenue']
      },
      {
        baseName: `Swiss ${sector} Group`,
        contacts: ['Anna Schmidt', 'Luca Fontana', 'Sarah Weber'],
        description: `Solutions innovantes pour le secteur ${sector} basées à {canton}.`,
        evidences: ['Certification qualité', 'Nouveau marché', 'Partenariats stratégiques']
      },
      {
        baseName: `${sector} Pro Services`,
        contacts: ['Marc Dubois', 'Elena Rossi', 'Thomas Keller'],
        description: `Services professionnels spécialisés ${sector} pour {canton}.`,
        evidences: ['Nouveau service lancé', 'Équipe renforcée', 'Clients satisfaction 95%']
      }
    ]
  };
}

function getSectorData(sector: string) {
  const sectorLower = sector.toLowerCase();
  
  if (sectorLower.includes('technologie') || sectorLower.includes('tech') || sectorLower.includes('digital')) {
    return {
      companies: [
        {
          name: 'TechFlow Solutions SA',
          contact: 'Marc Dubois',
          email: 'marc.dubois@techflow.ch',
          description: 'Développement de solutions logicielles innovantes pour PME.',
          website: 'https://techflow.ch',
          evidences: ['Expansion d\'équipe développement', 'Nouveau contrat gouvernemental', 'Investissement R&D augmenté']
        },
        {
          name: 'SwissDigital Innovations',
          contact: 'Sarah Mueller',
          email: 'sarah@swissdigital.com',
          description: 'Transformation digitale pour entreprises traditionnelles.',
          website: 'https://swissdigital.com',
          evidences: ['Ouverture nouveau bureau Zurich', 'Partenariat avec Google Cloud', 'Certification ISO 27001']
        },
        {
          name: 'Alpine Code Labs',
          contact: 'Luca Fontana',
          email: 'luca@alpinecode.ch',
          description: 'Développement d\'applications mobiles et web.',
          website: 'https://alpinecode.ch',
          evidences: ['Application primée SwissTech', 'Levée de fonds 1.5M CHF', 'Équipe doublée en 6 mois']
        }
      ]
    };
  }
  
  if (sectorLower.includes('finance') || sectorLower.includes('banque') || sectorLower.includes('assurance')) {
    return {
      companies: [
        {
          name: 'Geneva Wealth Partners',
          contact: 'Philippe Rousseau',
          email: 'philippe@genevawealth.ch',
          description: 'Gestion de patrimoine pour clients fortunés.',
          website: 'https://genevawealth.ch',
          evidences: ['Nouveau produit crypto-monnaies', 'Partenariat banque privée', 'Actifs sous gestion +25%']
        },
        {
          name: 'Swiss FinTech Solutions',
          contact: 'Anna Weber',
          email: 'anna@swissfintech.com',
          description: 'Solutions fintech pour institutions financières.',
          website: 'https://swissfintech.com',
          evidences: ['Licence FINMA obtenue', 'API banking lancée', 'Contrat UBS signé']
        }
      ]
    };
  }
  
  if (sectorLower.includes('santé') || sectorLower.includes('médical') || sectorLower.includes('pharmacie')) {
    return {
      companies: [
        {
          name: 'MedTech Innovations SA',
          contact: 'Dr. Elena Rossi',
          email: 'elena@medtech-innov.ch',
          description: 'Développement d\'équipements médicaux innovants.',
          website: 'https://medtech-innov.ch',
          evidences: ['Brevet déposé FDA', 'Essais cliniques phase 2', 'Partenariat hôpital universitaire']
        },
        {
          name: 'Swiss Health Analytics',
          contact: 'Thomas Keller',
          email: 'thomas@healthanalytics.ch',
          description: 'Analytics et IA pour le secteur de la santé.',
          website: 'https://healthanalytics.ch',
          evidences: ['Contrat assurance maladie', 'IA diagnostic approuvée', 'Expansion européenne']
        }
      ]
    };
  }
  
  // Default for other sectors
  return {
    companies: [
      {
        name: `${sector} Excellence SA`,
        contact: 'Jean-Pierre Martin',
        email: `jp.martin@${sector.toLowerCase().replace(/\s+/g, '')}.ch`,
        description: `Entreprise leader dans le secteur ${sector}.`,
        website: `https://${sector.toLowerCase().replace(/\s+/g, '')}.ch`,
        evidences: ['Expansion internationale', 'Nouveaux investissements', 'Croissance soutenue']
      },
      {
        name: `Swiss ${sector} Group`,
        contact: 'Maria Gonzalez',
        email: `maria@swiss${sector.toLowerCase().replace(/\s+/g, '')}.com`,
        description: `Solutions innovantes pour le secteur ${sector}.`,
        website: `https://swiss${sector.toLowerCase().replace(/\s+/g, '')}.com`,
        evidences: ['Certification qualité', 'Nouveau marché européen', 'Partenariats stratégiques']
      }
    ]
  };
}

function getRandomLocation() {
  const locations = ['Zurich', 'Genève', 'Lausanne', 'Bâle', 'Berne', 'Lucerne', 'Saint-Gall'];
  return locations[Math.floor(Math.random() * locations.length)];
}

function getRandomCompanySize() {
  const sizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
  return sizes[Math.floor(Math.random() * sizes.length)];
}

function getRandomPriority(): ProspectPriority {
  const priorities: ProspectPriority[] = ['HIGH', 'HIGH', 'MEDIUM', 'LOW']; // Weighted towards HIGH for manual searches
  return priorities[Math.floor(Math.random() * priorities.length)];
}

function getRandomIntentSignals(): IntentSignal[] {
  const signals: IntentSignal[] = ['FUNDING', 'JOB_POSTING', 'EXPANSION', 'TECHNOLOGY_ADOPTION'];
  const count = Math.floor(Math.random() * 3) + 1;
  return signals.slice(0, count);
}
