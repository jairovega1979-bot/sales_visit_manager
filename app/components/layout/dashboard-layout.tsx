
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FadeIn } from '@/components/ui/micro-interactions';
import Image from 'next/image';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText, 
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Bell,
  Home,
  TrendingUp,
  Target,
  CheckSquare,
  Search,
  Radar
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DashboardErrorBoundary } from '@/components/error-boundary';

// Helper function to get user avatar
function getUserAvatar(firstName: string | null | undefined): string {
  const avatarMap: { [key: string]: string } = {
    'Pierre': '/avatars/avatar-pierre.png',
    'Marie': '/avatars/avatar-marie.png',
    'Sarah': '/avatars/avatar-sarah.png'
  };
  
  return avatarMap[firstName || ''] || '/birdlogyc-logo.png';
}

// Helper function to get user initials
function getUserInitials(name: string | null | undefined, firstName: string | null | undefined): string {
  if (firstName && name) {
    const lastName = name.split(' ').pop() || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  if (name) {
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  }
  return 'U';
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    id: string;
    email?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role?: string;
    territory?: string | null;
  };
}

export function DashboardLayout({ children, user: propUser }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user: authUser, signOut } = useAuth();
  
  // Use auth user if available, fallback to prop user
  // Default to MANAGER for demo purposes since we're testing manager functionality
  const user = authUser || propUser || {
    id: 'cmevym6140001pzulv86ez0zx',
    email: 'pierre@birdlogyc.com',
    name: 'Pierre Martin',
    firstName: 'Pierre',
    lastName: 'Martin',
    role: 'MANAGER',
    territory: 'Suisse Romande'
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/signin');
  };

  // Navigation menus based on user role
  const managerNavigation = [
    { name: 'Sales Manager', href: '/dashboard/sales-manager', icon: TrendingUp, className: 'bg-blue-500/20 text-blue-300 border border-blue-400/30' },
    { name: 'Prospection', href: '/dashboard/prospection', icon: Radar, className: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' },
    { name: 'Rapports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Tâches', href: '/dashboard/taches', icon: CheckSquare, className: 'bg-purple-500/20 text-purple-300 border border-purple-400/30' },
    { name: 'Agenda', href: '/dashboard/agenda', icon: Calendar },
    { name: 'Appels', href: '/dashboard/calls', icon: Phone },
  ];

  const salesRepNavigation = [
    { name: 'Tableau de Bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/dashboard/customers', icon: Users },
    { name: 'Prospection', href: '/dashboard/prospection', icon: Radar, className: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' },
    { name: 'Agenda', href: '/dashboard/agenda', icon: Calendar },
    { name: 'J\'attendais votre appel', href: '/dashboard/priority-calls', icon: Phone, className: 'bg-red-500/20 text-red-300 border border-red-400/30' },
    { name: 'Appels', href: '/dashboard/calls', icon: Phone },
    { name: 'Offres', href: '/dashboard/offers', icon: FileText },
    { name: 'Visites', href: '/dashboard/visits', icon: Building2 },
    { name: 'Itinéraires', href: '/dashboard/routes', icon: MapPin },
    { name: 'Ventes / Objectifs', href: '/dashboard/ventes/objectif', icon: Target, className: 'bg-green-500/20 text-green-300 border border-green-400/30' }
  ];

  const navigation = user?.role === 'MANAGER' ? managerNavigation : salesRepNavigation;

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-brand-gradient-dark text-white relative">
      {/* Background logo watermark */}
      <div className="absolute inset-0 bg-logo-watermark opacity-30"></div>
      
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6 border-b border-brand-blue/30 relative z-10">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm p-1">
          <Image
            src="/birdlogyc-logo.png"
            alt="birdlogyc logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white to-brand-sky bg-clip-text text-transparent">birdlogyc</span>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-brand-blue/30 relative z-10">
        <div className="text-sm text-brand-sky/80">Mode Démonstration</div>
        <div className="font-medium text-white">{user?.name || `${user?.firstName} ${user?.lastName}`}</div>
        <div className="text-xs text-brand-sky/60">{user?.role === 'MANAGER' ? 'Manager' : 'Représentant Commercial'}</div>
        {user?.territory && (
          <div className="text-xs text-brand-sky/60 mt-1">Territoire: {user.territory}</div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 relative z-10">
        {navigation?.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-xl backdrop-blur-sm transition-all duration-200 group ${
              item.className || 'hover:bg-white/10 border border-transparent hover:border-brand-sky/20'
            } ${item.name === 'J\'attendais votre appel' ? 'animate-pulse' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className={`h-5 w-5 transition-colors ${
              item.name === 'J\'attendais votre appel' 
                ? 'text-red-400 group-hover:text-red-200'
                : item.name === 'Ventes / Objectifs'
                ? 'text-green-400 group-hover:text-green-200'
                : item.name === 'Tâches'
                ? 'text-purple-400 group-hover:text-purple-200'
                : item.name === 'Prospection'
                ? 'text-emerald-400 group-hover:text-emerald-200'
                : 'text-brand-sky group-hover:text-white'
            }`} />
            <span className={`transition-colors ${
              item.name === 'J\'attendais votre appel' 
                ? 'text-red-300 group-hover:text-red-100 font-medium'
                : item.name === 'Ventes / Objectifs'
                ? 'text-green-300 group-hover:text-green-100 font-medium'
                : item.name === 'Tâches'
                ? 'text-purple-300 group-hover:text-purple-100 font-medium'
                : item.name === 'Prospection'
                ? 'text-emerald-300 group-hover:text-emerald-100 font-medium'
                : 'text-brand-sky group-hover:text-white'
            }`}>
              {item.name}
            </span>
            {item.name === 'J\'attendais votre appel' && (
              <div className="ml-auto w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
            )}
            {item.name === 'Ventes / Objectifs' && (
              <div className="ml-auto w-2 h-2 bg-green-400 rounded-full"></div>
            )}
            {item.name === 'Tâches' && (
              <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            )}
            {item.name === 'Prospection' && (
              <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-brand-blue/30 relative z-10">
        <Button
          variant="ghost"
          className="w-full justify-start text-brand-sky hover:text-white hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-brand-sky/20"
          onClick={() => {}}
        >
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-brand-sky hover:text-white hover:bg-white/10 backdrop-blur-sm mt-2 border border-transparent hover:border-brand-sky/20"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-brand-sky hover:text-white hover:bg-white/10 backdrop-blur-sm mt-2 border border-transparent hover:border-brand-sky/20"
          onClick={handleGoHome}
        >
          <Home className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>
      </div>
      
      {/* Hexagonal decoration */}
      <div className="absolute bottom-20 right-4 w-12 h-10 bg-brand-sky/20 clip-path-hexagon animate-brand-pulse"></div>
    </div>
  );

  return (
    <div className="h-screen flex bg-brand-gradient-soft">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header - Mobile Optimized */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-brand-sky/30 px-3 sm:px-4 py-3 sm:py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden text-brand-navy hover:bg-brand-sky/20 p-2 flex-shrink-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold text-brand-navy truncate">
                  {user?.role === 'MANAGER' ? 'Dashboard Manager' : 'Dashboard Commercial'}
                </h1>
                <p className="text-xs sm:text-sm text-brand-navy/70 mt-1 truncate">
                  Mode Démonstration - {user?.firstName || user?.name}
                </p>
              </div>
              <div className="block sm:hidden min-w-0">
                <h1 className="text-lg font-semibold text-brand-navy truncate">
                  {user?.role === 'MANAGER' ? 'Manager' : 'Commercial'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
              <Button variant="ghost" size="sm" className="text-brand-navy hover:bg-brand-sky/20 relative p-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-brand-blue rounded-full animate-pulse"></div>
              </Button>
              
              {/* User Profile Section - Mobile Optimized */}
              <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-brand-sky/30">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                  <AvatarImage 
                    src={getUserAvatar(user?.firstName)} 
                    alt={`Avatar ${user?.firstName || user?.name}`}
                  />
                  <AvatarFallback className="bg-brand-blue text-white text-xs sm:text-sm">
                    {getUserInitials(user?.name, user?.firstName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-brand-navy truncate">
                    {user?.firstName || user?.name}
                  </p>
                  <p className="text-xs text-brand-navy/60 truncate">
                    {user?.role === 'MANAGER' ? 'Manager' : 'Commercial'}
                  </p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGoHome} 
                className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:border-brand-navy hidden sm:flex"
              >
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Accueil</span>
              </Button>
              
              {/* Mobile Home Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGoHome} 
                className="border-brand-blue text-brand-blue hover:bg-brand-sky hover:border-brand-navy sm:hidden p-2"
              >
                <Home className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area with logo background - Mobile Optimized */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-logo-watermark relative">
          <FadeIn>
            <div className="relative z-10">
              <DashboardErrorBoundary>
                {children}
              </DashboardErrorBoundary>
            </div>
          </FadeIn>
          {/* Floating hexagonal decorations */}
          <div className="absolute top-20 right-20 w-8 h-7 bg-brand-sky/20 clip-path-hexagon animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-10 w-6 h-5 bg-brand-light-blue/15 clip-path-hexagon animate-brand-pulse" style={{animationDelay: '3s'}}></div>
        </main>
      </div>
    </div>
  );
}
