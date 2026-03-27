import type { Room } from '../types';
import { RoomCard } from './RoomCard';
import './RoomList.css';

interface RoomListProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

export function RoomList({ rooms, onSelectRoom }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="room-list-empty">
        <p>No rooms match your filters. Try adjusting your criteria.</p>
      </div>
    );
  }

  return (
    <div className="room-list">
      <p className="room-count">{rooms.length} room{rooms.length !== 1 ? 's' : ''} found</p>
      <div className="room-grid">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} onClick={() => onSelectRoom(room)} />
        ))}
      </div>
    </div>
  );
}
