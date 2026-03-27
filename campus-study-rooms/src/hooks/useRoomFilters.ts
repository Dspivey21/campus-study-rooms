import { useMemo, useState } from 'react';
import type { Filters, Feature, Room, TimeSlot } from '../types';
import { rooms } from '../data/rooms';
import { isRoomAvailable } from '../data/availability';

const initialFilters: Filters = {
  building: '',
  minCapacity: 0,
  features: [],
  timeSlot: null,
};

export function useRoomFilters() {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const setBuilding = (building: string) =>
    setFilters((f) => ({ ...f, building }));

  const setMinCapacity = (minCapacity: number) =>
    setFilters((f) => ({ ...f, minCapacity }));

  const toggleFeature = (feature: Feature) =>
    setFilters((f) => ({
      ...f,
      features: f.features.includes(feature)
        ? f.features.filter((ft) => ft !== feature)
        : [...f.features, feature],
    }));

  const setTimeSlot = (timeSlot: TimeSlot | null) =>
    setFilters((f) => ({ ...f, timeSlot }));

  const clearFilters = () => setFilters(initialFilters);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room: Room) => {
      if (filters.building && room.building !== filters.building) return false;
      if (filters.minCapacity && room.capacity < filters.minCapacity) return false;
      if (filters.features.length > 0 && !filters.features.every((f) => room.features.includes(f))) return false;
      if (filters.timeSlot) {
        const { date, startTime, endTime } = filters.timeSlot;
        if (date && startTime && endTime) {
          if (!isRoomAvailable(room.id, date, startTime, endTime)) return false;
        }
      }
      return true;
    });
  }, [filters]);

  return {
    filters,
    filteredRooms,
    setBuilding,
    setMinCapacity,
    toggleFeature,
    setTimeSlot,
    clearFilters,
  };
}
