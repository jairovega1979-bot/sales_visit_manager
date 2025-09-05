

import { NextRequest, NextResponse } from 'next/server';
import { mockUsers, mockCustomers, AppointmentType, AppointmentStatus, AppointmentPriority } from '@/lib/mock-data';
import { demoState } from '@/lib/demo-state';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

// GET /api/appointments - Récupérer tous les rendez-vous
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let appointments = [...demoState.appointments];

    // Filtrer par utilisateur si spécifié
    if (userId) {
      appointments = appointments.filter(appointment => appointment.assignedUserId === userId);
    }

    // Filtrer par plage de dates si spécifiées
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      appointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.startTime);
        return appointmentDate >= start && appointmentDate <= end;
      });
    }

    // Enrichir avec les données des utilisateurs et clients
    const enrichedAppointments = appointments.map(appointment => {
      const assignedUser = mockUsers.find(u => u.id === appointment.assignedUserId);
      const customer = appointment.customerId 
        ? mockCustomers.find(c => c.id === appointment.customerId)
        : null;

      return {
        ...appointment,
        assignedUser: assignedUser ? {
          id: assignedUser.id,
          name: assignedUser.name,
          firstName: assignedUser.firstName,
          lastName: assignedUser.lastName,
          email: assignedUser.email
        } : null,
        customer: customer ? {
          id: customer.id,
          customerName: customer.customerName,
          contactEmail: customer.contactEmail,
          location: customer.location
        } : null
      };
    });

    // Trier par date de début
    enrichedAppointments.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return NextResponse.json({
      appointments: enrichedAppointments,
      count: enrichedAppointments.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des rendez-vous' },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Créer un nouveau rendez-vous
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      title,
      description,
      startTime,
      endTime,
      location,
      isAllDay = false,
      type = 'MEETING',
      status = 'SCHEDULED',
      priority = 'MEDIUM',
      reminderMinutes = 15,
      isRecurring = false,
      notes,
      assignedUserId,
      customerId
    } = body;

    // Validation des données requises
    if (!title || !startTime || !endTime || !assignedUserId) {
      return NextResponse.json(
        { error: 'Titre, dates de début/fin et utilisateur assigné sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que la date de fin est après la date de début
    if (new Date(endTime) <= new Date(startTime) && !isAllDay) {
      return NextResponse.json(
        { error: 'La date de fin doit être après la date de début' },
        { status: 400 }
      );
    }

    // Créer le nouveau rendez-vous
    const newAppointment = {
      id: uuidv4(),
      title,
      description,
      startTime,
      endTime,
      location,
      isAllDay,
      type: type as AppointmentType,
      status: status as AppointmentStatus,
      priority: priority as AppointmentPriority,
      reminderMinutes,
      isRecurring,
      notes,
      assignedUserId,
      customerId: customerId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Ajouter à l'état démo
    demoState.appointments.push(newAppointment);

    // Enrichir avec les données de l'utilisateur et du client
    const assignedUser = mockUsers.find(u => u.id === newAppointment.assignedUserId);
    const customer = newAppointment.customerId 
      ? mockCustomers.find(c => c.id === newAppointment.customerId)
      : null;

    const enrichedAppointment = {
      ...newAppointment,
      assignedUser: assignedUser ? {
        id: assignedUser.id,
        name: assignedUser.name,
        firstName: assignedUser.firstName,
        lastName: assignedUser.lastName,
        email: assignedUser.email
      } : null,
      customer: customer ? {
        id: customer.id,
        customerName: customer.customerName,
        contactEmail: customer.contactEmail,
        location: customer.location
      } : null
    };

    return NextResponse.json(enrichedAppointment, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du rendez-vous' },
      { status: 500 }
    );
  }
}

// PUT /api/appointments - Mettre à jour un rendez-vous
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID du rendez-vous requis' },
        { status: 400 }
      );
    }

    // Trouver et mettre à jour le rendez-vous
    const appointmentIndex = demoState.appointments.findIndex(a => a.id === id);
    
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Préparer les données de mise à jour
    const updatedAppointment = {
      ...demoState.appointments[appointmentIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    demoState.appointments[appointmentIndex] = updatedAppointment;

    // Enrichir avec les données de l'utilisateur et du client
    const assignedUser = mockUsers.find(u => u.id === updatedAppointment.assignedUserId);
    const customer = updatedAppointment.customerId 
      ? mockCustomers.find(c => c.id === updatedAppointment.customerId)
      : null;

    const enrichedAppointment = {
      ...updatedAppointment,
      assignedUser: assignedUser ? {
        id: assignedUser.id,
        name: assignedUser.name,
        firstName: assignedUser.firstName,
        lastName: assignedUser.lastName,
        email: assignedUser.email
      } : null,
      customer: customer ? {
        id: customer.id,
        customerName: customer.customerName,
        contactEmail: customer.contactEmail,
        location: customer.location
      } : null
    };

    return NextResponse.json(enrichedAppointment);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du rendez-vous' },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments - Supprimer un rendez-vous
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID du rendez-vous requis' },
        { status: 400 }
      );
    }

    // Trouver et supprimer le rendez-vous
    const appointmentIndex = demoState.appointments.findIndex(a => a.id === id);
    
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    demoState.appointments.splice(appointmentIndex, 1);

    return NextResponse.json({ message: 'Rendez-vous supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du rendez-vous' },
      { status: 500 }
    );
  }
}
