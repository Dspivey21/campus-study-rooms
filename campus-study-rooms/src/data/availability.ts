import type { Booking } from '../types';

// Simulated existing bookings
export const bookings: Booking[] = [
  { roomId: 'lib-101', slot: { date: '2026-03-27', startTime: '09:00', endTime: '11:00' }, bookedBy: 'Alice' },
  { roomId: 'lib-101', slot: { date: '2026-03-27', startTime: '14:00', endTime: '16:00' }, bookedBy: 'Bob' },
  { roomId: 'lib-204', slot: { date: '2026-03-27', startTime: '10:00', endTime: '12:00' }, bookedBy: 'Carol' },
  { roomId: 'lib-310', slot: { date: '2026-03-27', startTime: '13:00', endTime: '15:00' }, bookedBy: 'Dave' },
  { roomId: 'eng-105', slot: { date: '2026-03-27', startTime: '09:00', endTime: '10:30' }, bookedBy: 'Eve' },
  { roomId: 'eng-105', slot: { date: '2026-03-28', startTime: '11:00', endTime: '13:00' }, bookedBy: 'Frank' },
  { roomId: 'eng-202', slot: { date: '2026-03-28', startTime: '09:00', endTime: '11:00' }, bookedBy: 'Grace' },
  { roomId: 'sci-110', slot: { date: '2026-03-27', startTime: '15:00', endTime: '17:00' }, bookedBy: 'Hank' },
  { roomId: 'sci-215', slot: { date: '2026-03-28', startTime: '10:00', endTime: '12:00' }, bookedBy: 'Ivy' },
  { roomId: 'stu-101', slot: { date: '2026-03-27', startTime: '12:00', endTime: '14:00' }, bookedBy: 'Jack' },
  { roomId: 'stu-305', slot: { date: '2026-03-27', startTime: '08:00', endTime: '10:00' }, bookedBy: 'Kim' },
  { roomId: 'stu-210', slot: { date: '2026-03-27', startTime: '16:00', endTime: '18:00' }, bookedBy: 'Leo' },
  { roomId: 'stu-210', slot: { date: '2026-03-28', startTime: '09:00', endTime: '12:00' }, bookedBy: 'Mia' },
];

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function slotsOverlap(
  a: { startTime: string; endTime: string },
  b: { startTime: string; endTime: string },
): boolean {
  const aStart = timeToMinutes(a.startTime);
  const aEnd = timeToMinutes(a.endTime);
  const bStart = timeToMinutes(b.startTime);
  const bEnd = timeToMinutes(b.endTime);
  return aStart < bEnd && bStart < aEnd;
}

export function isRoomAvailable(roomId: string, date: string, startTime: string, endTime: string): boolean {
  return !bookings.some(
    (b) =>
      b.roomId === roomId &&
      b.slot.date === date &&
      slotsOverlap(b.slot, { startTime, endTime }),
  );
}
