import { useState } from 'react';
import type { Room } from '../types';
import './RoomDetail.css';

interface RoomDetailProps {
  room: Room;
  onClose: () => void;
}

export function RoomDetail({ room, onClose }: RoomDetailProps) {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  return (
    <div className="room-detail-overlay" onClick={onClose}>
      <div className="room-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <h2>{room.building} — Room {room.roomNumber}</h2>

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
          <span className="detail-label">Description</span>
          <p className="detail-description">{room.description}</p>
        </div>

        {bookingConfirmed ? (
          <div className="booking-confirmation">
            Booking request submitted for {room.building} — {room.roomNumber}. You will receive a confirmation email shortly.
          </div>
        ) : (
          <button
            className="booking-btn"
            onClick={() => setBookingConfirmed(true)}
          >
            Request Booking
          </button>
        )}
      </div>
    </div>
  );
}
