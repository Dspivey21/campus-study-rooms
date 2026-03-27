import type { StudyRoom } from '../types';
import './RoomDetail.css';

interface RoomDetailProps {
  room: StudyRoom | null;
  onClose: () => void;
  onRequestBooking: (room: StudyRoom) => void;
}

export function RoomDetail({ room, onClose, onRequestBooking }: RoomDetailProps) {
  if (!room) return null;

  return (
    <div className="room-detail-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="room-detail-heading">
      <div className="room-detail" onClick={(e) => e.stopPropagation()}>
        <h2 id="room-detail-heading">{room.building} — Room {room.roomNumber}</h2>

        <div className="detail-row">
          <span className="detail-label">Floor</span>
          <span className="detail-value">{room.floor}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Capacity</span>
          <span className="detail-value">{room.capacity} seats</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Features</span>
          <div className="detail-features">
            {room.features.map((f) => (
              <span key={f} className="feature-tag">{f}</span>
            ))}
          </div>
        </div>

        <div className="detail-row">
          <span className="detail-label">Quiet</span>
          <span className="detail-value">{room.isQuiet ? 'Yes' : 'No'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Whiteboard</span>
          <span className="detail-value">{room.hasWhiteboard ? 'Yes' : 'No'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Monitor</span>
          <span className="detail-value">{room.hasMonitor ? 'Yes' : 'No'}</span>
        </div>

        <div className="detail-actions">
          <button className="booking-btn" onClick={() => onRequestBooking(room)}>
            Request Booking
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
