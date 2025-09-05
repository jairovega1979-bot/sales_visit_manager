
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Filter,
  List,
  Grid3X3,
  Eye,
  Settings
} from 'lucide-react';
import { CalendarView } from '@/components/agenda/calendar-view';
import { AppointmentDialog } from '@/components/agenda/appointment-dialog';
import { getSwissHolidays, getCurrentMonthHolidays, type SwissHoliday } from '@/lib/swiss-holidays';
import { cn } from '@/lib/utils';

export type ViewType = 'month' | 'week' | 'day' | 'agenda';

interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isAllDay: boolean;
  type: string;
  status: string;
  priority: string;
  customer?: {
    id: string;
    customerName: string;
  };
}

export default function AgendaPage() {
  const [currentView, setCurrentView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [holidays, setHolidays] = useState<SwissHoliday[]>([]);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les jours fériés du mois
  useEffect(() => {
    const monthHolidays = getCurrentMonthHolidays('GE'); // Genève par défaut
    setHolidays(monthHolidays);
  }, [currentDate]);

  // Charger les rendez-vous depuis l'API
  const loadAppointments = async () => {
    setLoading(true);
    try {
      // Calculer la plage de dates pour le mois courant
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const params = new URLSearchParams({
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString()
      });

      const response = await fetch(`/api/appointments?${params}`);
      if (response.ok) {
        const data = await response.json();
        // Convertir les dates string en objets Date
        const appointmentsData = data.appointments.map((apt: any) => ({
          ...apt,
          startTime: new Date(apt.startTime),
          endTime: new Date(apt.endTime)
        }));
        setAppointments(appointmentsData);
      } else {
        console.error('Erreur lors du chargement des rendez-vous');
        setAppointments([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [currentDate]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (currentView) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const getDateRangeText = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };
    
    switch (currentView) {
      case 'day':
        return currentDate.toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'week':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('fr-FR', { day: 'numeric' })} - ${weekEnd.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}`;
      case 'month':
        return currentDate.toLocaleDateString('fr-FR', options);
      case 'agenda':
        return 'Vue Agenda';
      default:
        return '';
    }
  };

  const getTodayAppointments = () => {
    const today = new Date();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime);
      return (
        aptDate.getDate() === today.getDate() &&
        aptDate.getMonth() === today.getMonth() &&
        aptDate.getFullYear() === today.getFullYear()
      );
    });
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return appointments
      .filter(apt => new Date(apt.startTime) >= tomorrow)
      .slice(0, 5);
  };

  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = getUpcomingAppointments();

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="bg-gradient-to-br from-brand-navy via-brand-blue to-brand-light-blue rounded-3xl text-white p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Agenda Commercial</h1>
                <p className="text-white/80 text-sm">
                  Gérez vos rendez-vous et planifiez vos journées
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAppointmentDialog(true)}
                size="lg"
                className="bg-white text-brand-navy hover:bg-brand-sky hover:text-brand-navy hover:scale-105 transition-all duration-300 shadow-lg font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Nouveau RDV
              </Button>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Aujourd'hui</p>
                  <p className="text-2xl font-bold text-white">{todayAppointments.length}</p>
                </div>
                <Clock className="h-8 w-8 text-white/60" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Cette semaine</p>
                  <p className="text-2xl font-bold text-white">{appointments.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-white/60" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Jours fériés</p>
                  <p className="text-2xl font-bold text-white">{holidays.length}</p>
                </div>
                <MapPin className="h-8 w-8 text-white/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Décorations */}
        <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-2xl rotate-12 animate-brand-pulse"></div>
        <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-tr from-brand-sky/30 to-transparent rounded-xl -rotate-12 animate-float"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendrier principal */}
        <div className="lg:col-span-3">
          <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between bg-brand-sky/20 rounded-t-lg">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('prev')}
                  className="border-brand-blue text-brand-blue hover:bg-brand-sky"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-lg text-brand-navy font-bold">
                  {getDateRangeText()}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate('next')}
                  className="border-brand-blue text-brand-blue hover:bg-brand-sky"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Boutons de vue */}
              <div className="flex space-x-1 bg-white/50 rounded-lg p-1">
                {[
                  { key: 'month' as ViewType, icon: Grid3X3, label: 'Mois' },
                  { key: 'week' as ViewType, icon: List, label: 'Semaine' },
                  { key: 'day' as ViewType, icon: Eye, label: 'Jour' }
                ].map((view) => (
                  <Button
                    key={view.key}
                    variant={currentView === view.key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentView(view.key)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium transition-all duration-200',
                      currentView === view.key
                        ? 'bg-brand-blue text-white shadow-sm'
                        : 'text-brand-navy hover:bg-brand-sky/50'
                    )}
                  >
                    <view.icon className="h-3 w-3 mr-1" />
                    {view.label}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                </div>
              ) : (
                <CalendarView
                  view={currentView}
                  currentDate={currentDate}
                  appointments={appointments}
                  holidays={holidays}
                  onDateClick={(date) => {
                    setCurrentDate(date);
                    if (currentView !== 'day') setCurrentView('day');
                  }}
                  onAppointmentClick={setSelectedAppointment}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div className="lg:col-span-1 space-y-6">
          {/* Rendez-vous d'aujourd'hui */}
          <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl">
            <CardHeader className="bg-brand-light-blue/20 rounded-t-lg">
              <CardTitle className="text-sm text-brand-navy font-bold flex items-center">
                <Clock className="mr-2 h-4 w-4 text-brand-blue" />
                Aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {todayAppointments.length === 0 ? (
                <p className="text-brand-navy/60 text-sm text-center py-4">
                  Aucun rendez-vous aujourd'hui
                </p>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 bg-brand-sky/20 rounded-lg border border-brand-sky/30 cursor-pointer hover:bg-brand-sky/30 transition-colors"
                      onClick={() => setSelectedAppointment(apt)}
                    >
                      <h4 className="font-medium text-brand-navy text-sm">{apt.title}</h4>
                      <div className="flex items-center text-xs text-brand-navy/70 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(apt.startTime).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      {apt.location && (
                        <div className="flex items-center text-xs text-brand-navy/70 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {apt.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Jours fériés */}
          {holidays.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border border-brand-sky/30 shadow-xl">
              <CardHeader className="bg-orange-50 rounded-t-lg">
                <CardTitle className="text-sm text-brand-navy font-bold flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-orange-600" />
                  Jours fériés
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {holidays.slice(0, 3).map((holiday, index) => (
                    <div key={index} className="p-2 bg-orange-50 rounded-lg">
                      <p className="font-medium text-brand-navy text-sm">{holiday.name}</p>
                      <p className="text-xs text-brand-navy/70">
                        {holiday.date.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dialog pour créer/éditer un rendez-vous */}
      <AppointmentDialog
        open={showAppointmentDialog || !!selectedAppointment}
        onOpenChange={(open) => {
          if (!open) {
            setShowAppointmentDialog(false);
            setSelectedAppointment(null);
          }
        }}
        appointment={selectedAppointment}
        onSave={async (appointmentData) => {
          try {
            // Récupérer l'ID du premier utilisateur (pour la démo)
            const usersResponse = await fetch('/api/users?limit=1');
            const usersData = await usersResponse.json();
            const userId = usersData.users?.[0]?.id;

            if (!userId) {
              console.error('Aucun utilisateur trouvé');
              return;
            }

            // Préparer les données pour l'API
            const apiData = {
              title: appointmentData.title,
              description: appointmentData.description || null,
              startTime: new Date(`${appointmentData.startDate}T${appointmentData.startTime}`).toISOString(),
              endTime: new Date(`${appointmentData.endDate}T${appointmentData.endTime}`).toISOString(),
              location: appointmentData.location || null,
              isAllDay: appointmentData.isAllDay,
              type: appointmentData.type,
              status: appointmentData.status,
              priority: appointmentData.priority,
              reminderMinutes: appointmentData.reminderMinutes || 15,
              assignedUserId: userId,
              customerId: appointmentData.customerId === 'no-customer' || !appointmentData.customerId ? null : appointmentData.customerId,
              notes: appointmentData.notes || null
            };

            let response;
            if (selectedAppointment) {
              // Modification d'un rendez-vous existant
              response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
              });
            } else {
              // Création d'un nouveau rendez-vous
              response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
              });
            }

            if (response.ok) {
              // Recharger les rendez-vous
              await loadAppointments();
              setShowAppointmentDialog(false);
              setSelectedAppointment(null);
              console.log('Rendez-vous sauvegardé avec succès');
            } else {
              const errorText = await response.text();
              console.error('Erreur lors de la sauvegarde:', response.status, errorText);
            }
          } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
          }
        }}
        onDelete={async (appointmentId) => {
          try {
            const response = await fetch(`/api/appointments/${appointmentId}`, {
              method: 'DELETE'
            });

            if (response.ok) {
              // Recharger les rendez-vous
              await loadAppointments();
              console.log('Rendez-vous supprimé avec succès');
            } else {
              console.error('Erreur lors de la suppression du rendez-vous');
            }
          } catch (error) {
            console.error('Erreur lors de la suppression:', error);
          }
        }}
      />
    </div>
  );
}
