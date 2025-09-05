
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SalesObjectivesModule } from '@/components/sales-objectives/sales-objectives-module';
import { useAuth } from '@/hooks/useAuth';

export default function SalesObjectivesPage() {
  const { user } = useAuth();
  
  // Mock user for demo purposes if no auth user
  const demoUser = {
    role: 'SALES_REP', // or 'MANAGER' for manager view
    firstName: 'Pierre',
    lastName: 'Martin'
  };

  const currentUser = user || demoUser;
  const userName = currentUser.firstName && currentUser.lastName 
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : 'Pierre Martin';

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </Link>
        <div className="text-sm text-gray-500">
          <span>Dashboard</span>
          <span className="mx-2">/</span>
          <span>Ventes</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Objectifs</span>
        </div>
      </div>

      {/* Main Module */}
      <SalesObjectivesModule 
        userRole={currentUser.role}
        userName={userName}
      />
    </div>
  );
}
