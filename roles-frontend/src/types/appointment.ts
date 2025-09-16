export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  client: Client;
  resourceId: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
  price?: number;
  notes?: string;
  color?: string;
}

export interface AppointmentUpdate {
  start?: string;
  end?: string;
  resourceId?: string;
}

export interface DragEventData {
  appointment: Appointment;
  newStart: string;
  newEnd: string;
  newResourceId?: string;
}