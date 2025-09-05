
// Simplified auth system for demo mode

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: 'SALES_REP' | 'MANAGER' | 'ADMIN';
  territory?: string;
}

// Demo users for the application
export const demoUsers: DemoUser[] = [
  {
    id: 'cmevym6140001pzulv86ez0zx',
    email: 'pierre@birdlogyc.com',
    name: 'Pierre Martin',
    firstName: 'Pierre',
    lastName: 'Martin',
    role: 'MANAGER',
    territory: 'Suisse Romande'
  },
  {
    id: 'cmevym6120000pzultnfb7d49',
    email: 'manager@birdlogyc.com', 
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'MANAGER',
    territory: 'Suisse Romande'
  },
  {
    id: 'cmevym6160002pzulln8nonnp',
    email: 'marie@birdlogyc.com',
    name: 'Marie Dubois',
    firstName: 'Marie',
    lastName: 'Dubois',
    role: 'SALES_REP',
    territory: 'Lausanne'
  }
];

// Simple session management
export class AuthManager {
  private static readonly SESSION_KEY = 'birdlogyc_session';
  
  static getCurrentUser(): DemoUser | null {
    if (typeof window === 'undefined') {
      // Server-side: no user by default (avoid hydration issues)
      return null;
    }
    
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.expires > Date.now()) {
          return session.user;
        } else {
          this.logout();
        }
      }
    } catch (error) {
      console.warn('Session parsing error:', error);
      this.logout();
    }
    
    return null;
  }
  
  static login(email: string): DemoUser | null {
    console.log('AuthManager.login called with:', email);
    console.log('Available demo users:', demoUsers.map(u => u.email));
    
    const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    console.log('Found user:', user);
    
    if (user) {
      const session = {
        user,
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
          console.log('Session saved to localStorage');
        } catch (error) {
          console.error('Failed to save session to localStorage:', error);
        }
      }
      
      return user;
    }
    console.log('No matching user found for email:', email);
    return null;
  }
  
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }
  
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

// Auth configuration for demo mode
export const authOptions = {
  demo: true,
  users: demoUsers,
  manager: AuthManager
};
