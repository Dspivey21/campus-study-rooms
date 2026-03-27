import type { Room } from '../types';
import './RoomCard.css';

interface RoomCardProps {
  room: Room;
  onClick: () => void;
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  return (
    <div className="room-card" onClick={onClick}>
      <div className="room-card-header">
        <h3>{room.building} — {room.roomNumber}</h3>
        <span className="capacity-badge">{room.capacity} seats</span>
      </div>
      <div className="room-card-features">
        {room.features.map((f) => (
          <span key={f} className="feature-tag">{f}</span>
        ))}
      </div>
    </div>
  );
}
