
import { NextRequest, NextResponse } from 'next/server';
import { mockUsers, mockCustomers } from '@/lib/mock-data';
import { demoState } from '@/lib/demo-state';

export const dynamic = 'force-dynamic';

// GET /api/appointments/[id] - Récupérer un rendez-vous spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID du rendez-vous requis' },
        { status: 400 }
      );
    }

    const appointment = demoState.appointments.find(a => a.id === id);

    if (!appointment) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Enrichir avec les données de l'utilisateur et du client
    const assignedUser = mockUsers.find(u => u.id === appointment.assignedUserId);
    const customer = appointment.customerId 
      ? mockCustomers.find(c => c.id === appointment.customerId)
      : null;

    const enrichedAppointment = {
      ...appointment,
      assignedUser: assignedUser ? {
        id: assignedUser.id,
        name: assignedUser.name,
        firstName: assignedUser.firstName,
        lastName: assignedUser.lastName,
        email: assignedUser.email,
        territory: assignedUser.territory
      } : null,
      customer: customer ? {
        id: customer.id,
        customerName: customer.customerName,
        mainContact: customer.mainContact,
        contactEmail: customer.contactEmail,
        contactPhone: customer.contactPhone,
        location: customer.location,
        latitude: customer.latitude,
        longitude: customer.longitude
      } : null
    };

    return NextResponse.json(enrichedAppointment);
  } catch (error) {
    console.error('Erreur lors de la récupération du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du rendez-vous' },
      { status: 500 }
    );
  }
}

// PUT /api/appointments/[id] - Mettre à jour un rendez-vous spécifique
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID du rendez-vous requis' },
        { status: 400 }
      );
    }

    // Trouver le rendez-vous
    const appointmentIndex = demoState.appointments.findIndex(a => a.id === id);

    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    const {
      title,
      description,
      startTime,
      endTime,
      location,
      isAllDay,
      type,
      status,
      priority,
      reminderMinutes,
      notes,
      customerId
    } = body;

    // Mettre à jour le rendez-vous
    const updatedAppointment = {
      ...demoState.appointments[appointmentIndex],
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
      ...(location !== undefined && { location }),
      ...(isAllDay !== undefined && { isAllDay }),
      ...(type && { type }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(reminderMinutes !== undefined && { reminderMinutes }),
      ...(notes !== undefined && { notes }),
      ...(customerId !== undefined && { customerId: customerId || undefined }),
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
        email: assignedUser.email,
        territory: assignedUser.territory
      } : null,
      customer: customer ? {
        id: customer.id,
        customerName: customer.customerName,
        mainContact: customer.mainContact,
        contactEmail: customer.contactEmail,
        contactPhone: customer.contactPhone,
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

// DELETE /api/appointments/[id] - Supprimer un rendez-vous spécifique
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    return NextResponse.json({ 
      message: 'Rendez-vous supprimé avec succès',
      deletedId: id 
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du rendez-vous' },
      { status: 500 }
    );
  }
}
