import { useCallback, useMemo, useState } from 'react';
import type { StudyRoom } from './types';
import { STUDY_ROOMS } from './data/rooms';
import { RoomFilters, type ActiveFilters } from './components/RoomFilters';
import './App.css';

/* ------------------------------------------------------------------ */
/*  Availability helper                                                */
/* ------------------------------------------------------------------ */

/**
 * Deterministic simulated availability.
 *
 * Rules (purely client-side, no real backend):
 *  1. Library rooms are closed (unavailable) before 08:00 and after 22:00.
 *  2. Engineering Hall rooms are busy on weekdays between 12:00–13:00
 *     (lunch-hour maintenance block).
 *  3. Science Center rooms are unavailable on weekends.
 *  4. Rooms whose numeric room number is even are "booked" on even
 *     calendar days between 14:00–16:00.
 *
 * A room is available if NONE of the above rules make it busy during
 * the requested [startTime, endTime) window.
 */
function isRoomAvailable(
  room: StudyRoom,
  date: string,
  startTime: string,
  endTime: string,
): boolean {
  const dayOfWeek = new Date(date).getDay(); // 0 = Sun, 6 = Sat
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const dayOfMonth = Number(date.split('-')[2]);

  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  // Rule 1 – Library hours: 08:00 – 22:00
  if (room.building === 'Library') {
    if (start < timeToMinutes('08:00') || end > timeToMinutes('22:00')) {
      return false;
    }
  }

  // Rule 2 – Engineering Hall weekday lunch block: 12:00 – 13:00
  if (room.building === 'Engineering Hall' && !isWeekend) {
    if (rangesOverlap(start, end, timeToMinutes('12:00'), timeToMinutes('13:00'))) {
      return false;
    }
  }

  // Rule 3 – Science Center closed on weekends
  if (room.building === 'Science Center' && isWeekend) {
    return false;
  }

  // Rule 4 – Even room numbers booked on even days 14:00 – 16:00
  const roomNum = parseInt(room.roomNumber, 10);
  if (roomNum % 2 === 0 && dayOfMonth % 2 === 0) {
    if (rangesOverlap(start, end, timeToMinutes('14:00'), timeToMinutes('16:00'))) {
      return false;
    }
  }

  return true;
}

/* ------------------------------------------------------------------ */
/*  Small utility helpers                                              */
/* ------------------------------------------------------------------ */

/** Convert "HH:MM" to total minutes since midnight. */
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/** Return true when two half-open intervals [s1,e1) and [s2,e2) overlap. */
function rangesOverlap(s1: number, e1: number, s2: number, e2: number): boolean {
  return s1 < e2 && s2 < e1;
}

/** Apply the attribute-based filters (building, capacity, features). */
function applyAttributeFilters(
  rooms: StudyRoom[],
  filters: ActiveFilters,
): StudyRoom[] {
  return rooms.filter((room) => {
    if (filters.building && room.building !== filters.building) return false;
    if (filters.minCapacity && room.capacity < filters.minCapacity) return false;

    for (const f of filters.features) {
      if (f === 'Whiteboard' && !room.hasWhiteboard) return false;
      if (f === 'Monitor' && !room.hasMonitor) return false;
      if (f === 'Quiet' && !room.isQuiet) return false;
    }

    return true;
  });
}

/** Apply the availability filter when date and times are all provided. */
function applyAvailabilityFilter(
  rooms: StudyRoom[],
  date: string,
  startTime: string,
  endTime: string,
): StudyRoom[] {
  if (!date || !startTime || !endTime) return rooms;
  return rooms.filter((room) => isRoomAvailable(room, date, startTime, endTime));
}

/* ------------------------------------------------------------------ */
/*  App component                                                      */
/* ------------------------------------------------------------------ */

function App() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    building: null,
    minCapacity: null,
    features: [],
  });

  // Availability state
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleFilterChange = useCallback(
    (_rooms: StudyRoom[], filters: ActiveFilters) => {
      setActiveFilters(filters);
    },
    [],
  );

  // Combine both filter stages into a single derived list
  const filteredRooms = useMemo(() => {
    const afterAttributes = applyAttributeFilters(STUDY_ROOMS, activeFilters);
    return applyAvailabilityFilter(afterAttributes, selectedDate, startTime, endTime);
  }, [activeFilters, selectedDate, startTime, endTime]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Campus Study Room Finder</h1>
      </header>

      {/* Date / time picker row */}
      <div className="availability-bar">
        <div className="availability-field">
          <label htmlFor="date-picker">Date</label>
          <input
            id="date-picker"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="availability-field">
          <label htmlFor="start-time">Start Time</label>
          <input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="availability-field">
          <label htmlFor="end-time">End Time</label>
          <input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <div className="app-layout">
        <aside className="filters-panel">
          <h2>Filters</h2>
          <RoomFilters allRooms={STUDY_ROOMS} onFilterChange={handleFilterChange} />
        </aside>

        <main className="room-list-panel">
          <h2>Available Rooms ({filteredRooms.length})</h2>
          <ul className="room-list">
            {filteredRooms.map((room) => (
              <li key={room.id} className="room-item">
                <div className="room-item-header">
                  <strong>{room.building} — {room.roomNumber}</strong>
                  <span className="room-capacity">{room.capacity} seats</span>
                </div>
                <div className="room-item-details">
                  <span>Floor {room.floor}</span>
                  {room.isQuiet && <span className="room-tag">Quiet</span>}
                  {room.hasWhiteboard && <span className="room-tag">Whiteboard</span>}
                  {room.hasMonitor && <span className="room-tag">Monitor</span>}
                  {room.features.map((f) => (
                    <span key={f} className="room-tag">{f}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}

export default App;
