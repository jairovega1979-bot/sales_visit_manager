
import { DashboardLayout } from '@/components/layout/dashboard-layout';

// Mock user for demo purposes
const mockUser = {
  id: '1',
  email: 'demo@birdlogyc.com',
  name: 'Utilisateur Demo',
  firstName: 'Demo',
  lastName: 'User',
  role: 'SALES_REP',
  territory: 'Genève'
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout user={mockUser}>
      {children}
    </DashboardLayout>
  );
}
