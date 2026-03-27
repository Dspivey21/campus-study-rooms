import { useCallback, useState } from 'react';
import type { StudyRoom } from './types';
import { STUDY_ROOMS } from './data/rooms';
import { RoomFilters, type ActiveFilters } from './components/RoomFilters';
import './App.css';

function App() {
  const [filteredRooms, setFilteredRooms] = useState<StudyRoom[]>(STUDY_ROOMS);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    building: null,
    minCapacity: null,
    features: [],
  });

  const handleFilterChange = useCallback(
    (rooms: StudyRoom[], filters: ActiveFilters) => {
      setFilteredRooms(rooms);
      setActiveFilters(filters);
    },
    [],
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Campus Study Room Finder</h1>
      </header>

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
