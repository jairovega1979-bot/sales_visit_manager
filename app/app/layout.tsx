
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

// Configuración básica de estabilidad solo para runtime
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  // Límites básicos solo en desarrollo
  process.setMaxListeners(50);
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'birdlogyc - Gestion des Visites Commerciales',
  description: 'Plateforme professionnelle de gestion des visites commerciales pour les entreprises suisses',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'birdlogyc',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1e40af',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
