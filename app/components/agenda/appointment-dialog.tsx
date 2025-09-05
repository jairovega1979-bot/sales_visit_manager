
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Plus,
  X,
  Save,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface AppointmentFormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  isAllDay: boolean;
  type: string;
  status: string;
  priority: string;
  customerId: string;
  reminderMinutes: number;
  isRecurring: boolean;
  attendees: Array<{
    name: string;
    email: string;
    phone: string;
    isOptional: boolean;
  }>;
  notes: string;
}

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment | null;
  onSave: (appointment: AppointmentFormData) => void;
  onDelete?: (appointmentId: string) => void;
}

const APPOINTMENT_TYPES = [
  { value: 'MEETING', label: 'Réunion', color: 'bg-brand-blue' },
  { value: 'CLIENT_VISIT', label: 'Visite client', color: 'bg-green-500' },
  { value: 'PRESENTATION', label: 'Présentation', color: 'bg-purple-500' },
  { value: 'TRAINING', label: 'Formation', color: 'bg-blue-500' },
  { value: 'CALL', label: 'Appel téléphonique', color: 'bg-indigo-500' },
  { value: 'CONFERENCE', label: 'Conférence', color: 'bg-pink-500' },
  { value: 'INTERNAL', label: 'Interne', color: 'bg-gray-500' },
  { value: 'PERSONAL', label: 'Personnel', color: 'bg-teal-500' },
  { value: 'OTHER', label: 'Autre', color: 'bg-orange-500' }
];

const APPOINTMENT_STATUSES = [
  { value: 'SCHEDULED', label: 'Programmé' },
  { value: 'CONFIRMED', label: 'Confirmé' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'CANCELLED', label: 'Annulé' },
  { value: 'POSTPONED', label: 'Reporté' },
  { value: 'NO_SHOW', label: 'Absence' }
];

const PRIORITIES = [
  { value: 'LOW', label: 'Basse', color: 'bg-gray-400' },
  { value: 'MEDIUM', label: 'Moyenne', color: 'bg-blue-400' },
  { value: 'HIGH', label: 'Élevée', color: 'bg-orange-500' },
  { value: 'URGENT', label: 'Urgente', color: 'bg-red-500' }
];

const REMINDER_OPTIONS = [
  { value: 0, label: 'Aucun rappel' },
  { value: 5, label: '5 minutes avant' },
  { value: 15, label: '15 minutes avant' },
  { value: 30, label: '30 minutes avant' },
  { value: 60, label: '1 heure avant' },
  { value: 120, label: '2 heures avant' },
  { value: 1440, label: '1 jour avant' }
];

// Mock customers - à remplacer par de vraies données
const MOCK_CUSTOMERS = [
  { id: '1', customerName: 'Nestlé SA' },
  { id: '2', customerName: 'UBS AG' },
  { id: '3', customerName: 'Rolex SA' },
  { id: '4', customerName: 'Migros' },
  { id: '5', customerName: 'Novartis AG' },
  { id: '6', customerName: 'Swatch Group' }
];

export function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
  onSave,
  onDelete
}: AppointmentDialogProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '10:00',
    location: '',
    isAllDay: false,
    type: 'MEETING',
    status: 'SCHEDULED',
    priority: 'MEDIUM',
    customerId: 'no-customer',
    reminderMinutes: 15,
    isRecurring: false,
    attendees: [],
    notes: ''
  });

  const [newAttendee, setNewAttendee] = useState({
    name: '',
    email: '',
    phone: '',
    isOptional: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialiser le formulaire avec les données du rendez-vous existant
  useEffect(() => {
    if (appointment) {
      const startTime = new Date(appointment.startTime);
      const endTime = new Date(appointment.endTime);
      
      setFormData({
        title: appointment.title,
        description: appointment.description || '',
        startDate: startTime.toISOString().split('T')[0],
        startTime: startTime.toTimeString().slice(0, 5),
        endDate: endTime.toISOString().split('T')[0],
        endTime: endTime.toTimeString().slice(0, 5),
        location: appointment.location || '',
        isAllDay: appointment.isAllDay,
        type: appointment.type,
        status: appointment.status,
        priority: appointment.priority,
        customerId: appointment.customer?.id || 'no-customer',
        reminderMinutes: 15,
        isRecurring: false,
        attendees: [],
        notes: ''
      });
    } else {
      // Réinitialiser pour un nouveau rendez-vous
      setFormData({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endDate: new Date().toISOString().split('T')[0],
        endTime: '10:00',
        location: '',
        isAllDay: false,
        type: 'MEETING',
        status: 'SCHEDULED',
        priority: 'MEDIUM',
        customerId: 'no-customer',
        reminderMinutes: 15,
        isRecurring: false,
        attendees: [],
        notes: ''
      });
    }
    setErrors({});
  }, [appointment, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }

    if (!formData.startTime && !formData.isAllDay) {
      newErrors.startTime = 'L\'heure de début est requise';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La date de fin est requise';
    }

    if (!formData.endTime && !formData.isAllDay) {
      newErrors.endTime = 'L\'heure de fin est requise';
    }

    // Validation des dates seulement si les champs sont remplis
    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime && !formData.isAllDay) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      if (endDateTime <= startDateTime) {
        newErrors.endTime = 'L\'heure de fin doit être après l\'heure de début';
      }
    }

    console.log('Validation - Erreurs trouvées:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.error('Validation échouée:', errors);
      return;
    }

    // Préparer les données finales avec conversion des valeurs spéciales
    const finalData = {
      ...formData,
      customerId: formData.customerId === "no-customer" ? "" : formData.customerId
    };

    console.log('Sauvegarde du rendez-vous:', finalData);
    onSave(finalData);
  };

  const addAttendee = () => {
    if (newAttendee.name && newAttendee.email) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, { ...newAttendee }]
      }));
      setNewAttendee({ name: '', email: '', phone: '', isOptional: false });
    }
  };

  const removeAttendee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Si on change l'heure de début, ajuster l'heure de fin automatiquement
      if (field === 'startTime') {
        const startTime = new Date(`2000-01-01T${value}`);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 heure
        newData.endTime = endTime.toTimeString().slice(0, 5);
      }
      
      return newData;
    });
  };

  const selectedType = APPOINTMENT_TYPES.find(t => t.value === formData.type);
  const selectedPriority = PRIORITIES.find(p => p.value === formData.priority);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-md lg:max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
        <DialogHeader className="p-4 sm:p-6">
          <DialogTitle className="flex items-center text-brand-navy text-lg sm:text-xl">
            <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {appointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations de base */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-brand-navy mb-4">Informations générales</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Titre du rendez-vous"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description détaillée (optionnelle)"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isAllDay"
                      checked={formData.isAllDay}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAllDay: checked }))}
                    />
                    <Label htmlFor="isAllDay">Toute la journée</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Date et heure */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-brand-navy mb-4">Date et heure</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de début</Label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    
                    {!formData.isAllDay && (
                      <div className="space-y-2">
                        <Label>Heure de début</Label>
                        <Input
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => handleTimeChange('startTime', e.target.value)}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Date de fin</Label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                    
                    {!formData.isAllDay && (
                      <div className="space-y-2">
                        <Label>Heure de fin</Label>
                        <Input
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                          className={errors.endTime ? 'border-red-500' : ''}
                        />
                        {errors.endTime && (
                          <p className="text-sm text-red-500">{errors.endTime}</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Participants */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-brand-navy mb-4">Participants</h3>
                  
                  {/* Liste des participants existants */}
                  {formData.attendees.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {formData.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-brand-sky/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <User className="h-4 w-4 text-brand-blue" />
                            <div>
                              <div className="font-medium text-brand-navy">{attendee.name}</div>
                              <div className="text-sm text-brand-navy/70">
                                {attendee.email} {attendee.phone && `• ${attendee.phone}`}
                              </div>
                            </div>
                            {attendee.isOptional && (
                              <Badge variant="outline" className="text-xs">Optionnel</Badge>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttendee(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Ajouter un participant */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <Input
                      placeholder="Nom"
                      value={newAttendee.name}
                      onChange={(e) => setNewAttendee(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={newAttendee.email}
                      onChange={(e) => setNewAttendee(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                      type="tel"
                      placeholder="Téléphone"
                      value={newAttendee.phone}
                      onChange={(e) => setNewAttendee(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="optional"
                        checked={newAttendee.isOptional}
                        onCheckedChange={(checked) => setNewAttendee(prev => ({ ...prev, isOptional: checked }))}
                      />
                      <Label htmlFor="optional" className="text-sm">Participation optionnelle</Label>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addAttendee}
                      disabled={!newAttendee.name || !newAttendee.email}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colonne latérale */}
            <div className="lg:col-span-1 space-y-6">
              {/* Catégorie et priorité */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-brand-navy mb-4">Catégorie</h3>
                  
                  <div className="space-y-2">
                    <Label>Type de rendez-vous</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {APPOINTMENT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center">
                              <div className={cn("w-3 h-3 rounded-full mr-2", type.color)} />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priorité</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map(priority => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center">
                              <div className={cn("w-3 h-3 rounded-full mr-2", priority.color)} />
                              {priority.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {APPOINTMENT_STATUSES.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Lieu et client */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-brand-navy mb-4">Détails</h3>
                  
                  <div className="space-y-2">
                    <Label>Lieu</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-brand-navy/60" />
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Adresse ou lieu de rendez-vous"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Client associé</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-customer">Aucun client</SelectItem>
                        {MOCK_CUSTOMERS.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.customerName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Rappel</Label>
                    <Select
                      value={formData.reminderMinutes.toString()}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, reminderMinutes: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REMINDER_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-brand-navy mb-4">Notes</h3>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Notes additionnelles..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {appointment && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    onDelete(appointment.id);
                    onOpenChange(false);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-brand-blue hover:bg-brand-navy"
              >
                <Save className="mr-2 h-4 w-4" />
                {appointment ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
