
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, UserCheck, Info } from 'lucide-react';
import { demoUsers } from '@/lib/auth';

export function DemoInfo() {
  const getAccountInfo = (user: any) => ({
    email: user.email,
    name: user.name,
    role: user.role,
    territory: user.territory,
    description: user.role === 'MANAGER' 
      ? 'Accès complet aux rapports et au tableau de bord Sales Manager'
      : 'Accès commercial standard avec gestion des clients et visites',
    icon: user.role === 'MANAGER' ? Shield : UserCheck
  });

  const demoAccounts = demoUsers.map(getAccountInfo);

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-brand-blue" />
          <span>Comptes de Démonstration Disponibles</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoAccounts.map((account, index) => {
            const IconComponent = account.icon;
            return (
              <div key={index} className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    account.role === 'MANAGER' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{account.name}</h3>
                    <Badge 
                      variant={account.role === 'MANAGER' ? 'default' : 'secondary'}
                      className={account.role === 'MANAGER' ? 'bg-blue-600' : ''}
                    >
                      {account.role}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Email:</span>{' '}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                      {account.email}
                    </code>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Territoire:</span> {account.territory}
                  </div>
                  <p className="text-xs text-gray-600">{account.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-900">Mot de passe pour tous les comptes :</p>
              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">demo123</code>
              <p className="text-blue-700 mt-2">
                Les comptes MANAGER ont accès au nouveau tableau de bord Sales Manager avec :
              </p>
              <ul className="text-blue-700 text-xs mt-1 ml-4 space-y-0.5">
                <li>• Ventes actuelles vs. objectifs</li>
                <li>• Entonnoir de ventes détaillé</li>
                <li>• Classement des commerciaux</li>
                <li>• Prédictions de fermeture</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
