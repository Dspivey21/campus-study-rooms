export type Feature = 'whiteboard' | 'quiet' | 'near coffee' | 'projector' | 'power outlets' | 'natural light';

export interface Room {
  id: string;
  building: string;
  roomNumber: string;
  capacity: number;
  features: Feature[];
  description: string;
}

export type StudyRoom = {
  id: string;
  building: string;
  roomNumber: string;
  capacity: number;
  features: string[];
  floor: number;
  isQuiet: boolean;
  hasWhiteboard: boolean;
  hasMonitor: boolean;
};

export interface TimeSlot {
  date: string;      // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
}

export interface Booking {
  roomId: string;
  slot: TimeSlot;
  bookedBy: string;
}

export interface Filters {
  building: string;
  minCapacity: number;
  features: Feature[];
  timeSlot: TimeSlot | null;
}
