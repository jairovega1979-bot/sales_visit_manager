
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Clock, MapPin, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type SwissHoliday } from '@/lib/swiss-holidays';

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

export type ViewType = 'month' | 'week' | 'day' | 'agenda';

interface CalendarViewProps {
  view: ViewType;
  currentDate: Date;
  appointments: Appointment[];
  holidays: SwissHoliday[];
  onDateClick: (date: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export function CalendarView({
  view,
  currentDate,
  appointments,
  holidays,
  onDateClick,
  onAppointmentClick
}: CalendarViewProps) {
  const getAppointmentColor = (type: string, priority: string) => {
    if (priority === 'URGENT') return 'bg-red-500 text-white border-red-600';
    if (priority === 'HIGH') return 'bg-orange-500 text-white border-orange-600';
    
    switch (type) {
      case 'MEETING':
        return 'bg-brand-blue text-white border-brand-blue';
      case 'CLIENT_VISIT':
        return 'bg-green-500 text-white border-green-600';
      case 'PRESENTATION':
        return 'bg-purple-500 text-white border-purple-600';
      case 'TRAINING':
        return 'bg-blue-500 text-white border-blue-600';
      case 'CALL':
        return 'bg-indigo-500 text-white border-indigo-600';
      default:
        return 'bg-brand-light-blue text-white border-brand-light-blue';
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getHolidayForDate = (date: Date) => {
    return holidays.find(holiday => 
      holiday.date.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return (
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  if (view === 'month') {
    return <MonthView 
      currentDate={currentDate}
      appointments={appointments}
      holidays={holidays}
      onDateClick={onDateClick}
      onAppointmentClick={onAppointmentClick}
      getAppointmentsForDate={getAppointmentsForDate}
      getHolidayForDate={getHolidayForDate}
      getAppointmentColor={getAppointmentColor}
      isToday={isToday}
      isCurrentMonth={isCurrentMonth}
    />;
  }

  if (view === 'week') {
    return <WeekView 
      currentDate={currentDate}
      appointments={appointments}
      holidays={holidays}
      onDateClick={onDateClick}
      onAppointmentClick={onAppointmentClick}
      getAppointmentsForDate={getAppointmentsForDate}
      getHolidayForDate={getHolidayForDate}
      getAppointmentColor={getAppointmentColor}
      isToday={isToday}
    />;
  }

  if (view === 'day') {
    return <DayView 
      currentDate={currentDate}
      appointments={appointments}
      holidays={holidays}
      onAppointmentClick={onAppointmentClick}
      getAppointmentsForDate={getAppointmentsForDate}
      getHolidayForDate={getHolidayForDate}
      getAppointmentColor={getAppointmentColor}
      isToday={isToday}
    />;
  }

  return null;
}

// Vue mensuelle
function MonthView({ 
  currentDate, 
  getAppointmentsForDate, 
  getHolidayForDate, 
  getAppointmentColor, 
  isToday, 
  isCurrentMonth, 
  onDateClick, 
  onAppointmentClick 
}: any) {
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Ajuster au début de la semaine
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));
  
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - ((endDate.getDay() + 6) % 7)));

  const weeks = [];
  let currentWeekStart = new Date(startDate);
  
  while (currentWeekStart <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      week.push(date);
    }
    weeks.push(week);
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }

  return (
    <div className="space-y-4">
      {/* En-tête des jours */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS_FR.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-semibold text-brand-navy bg-brand-sky/30 rounded-lg"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((date, dayIndex) => {
              const dayAppointments = getAppointmentsForDate(date);
              const holiday = getHolidayForDate(date);
              const todayFlag = isToday(date);
              const currentMonthFlag = isCurrentMonth(date);

              return (
                <Card
                  key={dayIndex}
                  className={cn(
                    "min-h-24 p-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105",
                    todayFlag
                      ? "bg-brand-blue/20 border-brand-blue border-2"
                      : currentMonthFlag
                      ? "bg-white border-brand-sky/30"
                      : "bg-gray-50 border-gray-200 opacity-60",
                    holiday && "bg-orange-50 border-orange-200"
                  )}
                  onClick={() => onDateClick(date)}
                >
                  <div className="space-y-1">
                    {/* Numéro du jour */}
                    <div className={cn(
                      "text-sm font-medium",
                      todayFlag ? "text-brand-blue font-bold" : "text-brand-navy",
                      !currentMonthFlag && "text-gray-400"
                    )}>
                      {date.getDate()}
                    </div>

                    {/* Jour férié */}
                    {holiday && (
                      <Badge variant="outline" className="text-xs px-1 py-0 bg-orange-100 text-orange-700 border-orange-300">
                        {holiday.name.substring(0, 8)}...
                      </Badge>
                    )}

                    {/* Rendez-vous */}
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((apt: Appointment) => (
                        <div
                          key={apt.id}
                          className={cn(
                            "text-xs p-1 rounded truncate cursor-pointer hover:scale-105 transition-transform",
                            getAppointmentColor(apt.type, apt.priority)
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAppointmentClick(apt);
                          }}
                        >
                          {new Date(apt.startTime).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} {apt.title}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-brand-navy/60 font-medium">
                          +{dayAppointments.length - 2} autres
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Vue hebdomadaire
function WeekView({ 
  currentDate, 
  getAppointmentsForDate, 
  getHolidayForDate, 
  getAppointmentColor, 
  isToday, 
  onDateClick, 
  onAppointmentClick 
}: any) {
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  return (
    <div className="space-y-4">
      {/* En-tête avec les jours */}
      <div className="grid grid-cols-8 gap-2">
        <div className="p-3 text-center text-sm font-semibold text-brand-navy">
          Heure
        </div>
        {weekDays.map((date, index) => {
          const holiday = getHolidayForDate(date);
          const todayFlag = isToday(date);
          
          return (
            <div
              key={index}
              className={cn(
                "p-3 text-center text-sm font-semibold rounded-lg cursor-pointer hover:bg-brand-sky/50 transition-colors",
                todayFlag ? "bg-brand-blue text-white" : "bg-brand-sky/30 text-brand-navy",
                holiday && "bg-orange-100 text-orange-800"
              )}
              onClick={() => onDateClick(date)}
            >
              <div>{DAYS_FR[index]}</div>
              <div className="text-lg font-bold">{date.getDate()}</div>
              {holiday && (
                <div className="text-xs text-orange-700 mt-1">Férié</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grille horaire */}
      <div className="max-h-96 overflow-y-auto border border-brand-sky/30 rounded-lg">
        <div className="grid grid-cols-8 gap-0 border-collapse">
          {HOURS.slice(7, 19).map((hour, hourIndex) => (
            <React.Fragment key={hour}>
              {/* Colonne des heures */}
              <div className="p-2 text-xs text-center text-brand-navy/60 bg-brand-sky/10 border-r border-brand-sky/30">
                {hour}
              </div>
              
              {/* Colonnes des jours */}
              {weekDays.map((date, dayIndex) => {
                const dayAppointments = getAppointmentsForDate(date);
                const hourAppointments = dayAppointments.filter((apt: Appointment) => {
                  const aptHour = new Date(apt.startTime).getHours();
                  return aptHour === hourIndex + 7;
                });

                return (
                  <div
                    key={`${dayIndex}-${hourIndex}`}
                    className={cn(
                      "min-h-16 p-1 border-r border-b border-brand-sky/20 hover:bg-brand-sky/20 transition-colors",
                      isToday(date) && "bg-brand-blue/10"
                    )}
                  >
                    {hourAppointments.map((apt: Appointment) => (
                      <div
                        key={apt.id}
                        className={cn(
                          "text-xs p-1 rounded mb-1 cursor-pointer hover:scale-105 transition-transform truncate",
                          getAppointmentColor(apt.type, apt.priority)
                        )}
                        onClick={() => onAppointmentClick(apt)}
                      >
                        {apt.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// Vue journalière
function DayView({ 
  currentDate, 
  getAppointmentsForDate, 
  getHolidayForDate, 
  getAppointmentColor, 
  isToday, 
  onAppointmentClick 
}: any) {
  const dayAppointments = getAppointmentsForDate(currentDate);
  const holiday = getHolidayForDate(currentDate);
  const todayFlag = isToday(currentDate);

  return (
    <div className="space-y-6">
      {/* En-tête du jour */}
      <div className={cn(
        "p-6 rounded-2xl text-center",
        todayFlag 
          ? "bg-brand-gradient-dark text-white" 
          : "bg-brand-sky/30 text-brand-navy",
        holiday && "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
      )}>
        <h2 className="text-2xl font-bold mb-2">
          {currentDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h2>
        {holiday && (
          <Badge className="bg-white/20 text-white border-white/40 mb-2">
            {holiday.name} - Jour férié
          </Badge>
        )}
        <p className="text-lg opacity-90">
          {dayAppointments.length} rendez-vous programmé{dayAppointments.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Planning horaire */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-1 space-y-2">
          {HOURS.slice(7, 20).map((hour) => (
            <div key={hour} className="h-20 flex items-center justify-center text-sm text-brand-navy/60 font-medium">
              {hour}
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-11 space-y-2">
          {HOURS.slice(7, 20).map((hour, index) => {
            const hourNum = index + 7;
            const hourAppointments = dayAppointments.filter((apt: Appointment) => {
              const aptHour = new Date(apt.startTime).getHours();
              return aptHour === hourNum;
            });

            return (
              <div
                key={hour}
                className={cn(
                  "min-h-20 p-3 rounded-lg border-2 border-dashed transition-all duration-200 hover:bg-brand-sky/20",
                  hourAppointments.length > 0 
                    ? "border-brand-blue/30 bg-brand-sky/10" 
                    : "border-gray-200 bg-gray-50"
                )}
              >
                {hourAppointments.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Créneaux libre
                  </div>
                ) : (
                  <div className="space-y-2">
                    {hourAppointments.map((apt: Appointment) => (
                      <Card
                        key={apt.id}
                        className={cn(
                          "p-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200",
                          getAppointmentColor(apt.type, apt.priority).replace('text-white', 'text-white border-2')
                        )}
                        onClick={() => onAppointmentClick(apt)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">{apt.title}</h3>
                            {apt.description && (
                              <p className="text-xs opacity-90 mb-2">{apt.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-xs opacity-90">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(apt.startTime).toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} - {new Date(apt.endTime).toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                              {apt.location && (
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {apt.location}
                                </div>
                              )}
                            </div>
                          </div>
                          {apt.priority === 'URGENT' && (
                            <AlertTriangle className="h-4 w-4 text-red-200" />
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Résumé du jour */}
      {dayAppointments.length > 0 && (
        <Card className="p-6 bg-brand-sky/20 border-brand-sky/30">
          <h3 className="text-lg font-semibold text-brand-navy mb-4">Résumé de la journée</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-blue">{dayAppointments.length}</div>
              <div className="text-sm text-brand-navy/70">Total RDV</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-blue">
                {dayAppointments.filter((apt: Appointment) => apt.priority === 'HIGH' || apt.priority === 'URGENT').length}
              </div>
              <div className="text-sm text-brand-navy/70">Priorité élevée</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-blue">
                {Math.round(dayAppointments.reduce((acc: number, apt: Appointment) => {
                  const duration = (new Date(apt.endTime).getTime() - new Date(apt.startTime).getTime()) / (1000 * 60);
                  return acc + duration;
                }, 0) / 60 * 10) / 10}h
              </div>
              <div className="text-sm text-brand-navy/70">Temps total</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
