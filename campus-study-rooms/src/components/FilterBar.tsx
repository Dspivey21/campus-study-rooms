import type { Feature, Filters, TimeSlot } from '../types';
import { buildings, allFeatures } from '../data/rooms';
import './FilterBar.css';

interface FilterBarProps {
  filters: Filters;
  onBuildingChange: (building: string) => void;
  onCapacityChange: (capacity: number) => void;
  onFeatureToggle: (feature: Feature) => void;
  onTimeSlotChange: (slot: TimeSlot | null) => void;
  onClear: () => void;
}

export function FilterBar({
  filters,
  onBuildingChange,
  onCapacityChange,
  onFeatureToggle,
  onTimeSlotChange,
  onClear,
}: FilterBarProps) {
  const handleTimeChange = (field: keyof TimeSlot, value: string) => {
    const current = filters.timeSlot ?? { date: '', startTime: '', endTime: '' };
    onTimeSlotChange({ ...current, [field]: value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <label htmlFor="building-select">Building</label>
        <select
          id="building-select"
          value={filters.building}
          onChange={(e) => onBuildingChange(e.target.value)}
        >
          <option value="">All Buildings</option>
          {buildings.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="capacity-input">Min Capacity</label>
        <input
          id="capacity-input"
          type="number"
          min={0}
          max={50}
          value={filters.minCapacity || ''}
          placeholder="Any"
          onChange={(e) => onCapacityChange(Number(e.target.value) || 0)}
        />
      </div>

      <div className="filter-section">
        <label>Features</label>
        <div className="feature-checkboxes">
          {allFeatures.map((feature) => (
            <label key={feature} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.features.includes(feature)}
                onChange={() => onFeatureToggle(feature)}
              />
              {feature}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label>Availability</label>
        <div className="time-inputs">
          <input
            type="date"
            value={filters.timeSlot?.date ?? ''}
            onChange={(e) => handleTimeChange('date', e.target.value)}
          />
          <input
            type="time"
            value={filters.timeSlot?.startTime ?? ''}
            onChange={(e) => handleTimeChange('startTime', e.target.value)}
          />
          <span className="time-separator">to</span>
          <input
            type="time"
            value={filters.timeSlot?.endTime ?? ''}
            onChange={(e) => handleTimeChange('endTime', e.target.value)}
          />
        </div>
      </div>

      <button className="clear-btn" onClick={onClear}>Clear Filters</button>
    </div>
  );
}
