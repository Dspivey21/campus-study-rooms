import { useState, useEffect, useMemo } from 'react';
import type { StudyRoom } from '../types';

export type ActiveFilters = {
  building: string | null;
  minCapacity: number | null;
  features: string[];
};

interface RoomFiltersProps {
  allRooms: StudyRoom[];
  onFilterChange: (filteredRooms: StudyRoom[], activeFilters: ActiveFilters) => void;
}

const FEATURE_OPTIONS = ['Whiteboard', 'Monitor', 'Quiet'] as const;

export function RoomFilters({ allRooms, onFilterChange }: RoomFiltersProps) {
  const [building, setBuilding] = useState<string | null>(null);
  const [minCapacity, setMinCapacity] = useState<number | null>(null);
  const [features, setFeatures] = useState<string[]>([]);

  const buildings = useMemo(
    () => [...new Set(allRooms.map((r) => r.building))],
    [allRooms],
  );

  useEffect(() => {
    const activeFilters: ActiveFilters = { building, minCapacity, features };

    const filtered = allRooms.filter((room) => {
      if (building && room.building !== building) return false;
      if (minCapacity && room.capacity < minCapacity) return false;

      for (const f of features) {
        if (f === 'Whiteboard' && !room.hasWhiteboard) return false;
        if (f === 'Monitor' && !room.hasMonitor) return false;
        if (f === 'Quiet' && !room.isQuiet) return false;
      }

      return true;
    });

    onFilterChange(filtered, activeFilters);
  }, [building, minCapacity, features, allRooms, onFilterChange]);

  const handleFeatureToggle = (feature: string) => {
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  };

  return (
    <div className="room-filters">
      <div className="filter-group">
        <label htmlFor="building-filter">Building</label>
        <select
          id="building-filter"
          value={building ?? ''}
          onChange={(e) => setBuilding(e.target.value || null)}
        >
          <option value="">All Buildings</option>
          {buildings.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="capacity-filter">Min Capacity</label>
        <input
          id="capacity-filter"
          type="number"
          min={1}
          placeholder="Any"
          value={minCapacity ?? ''}
          onChange={(e) => setMinCapacity(e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      <div className="filter-group">
        <label>Features</label>
        {FEATURE_OPTIONS.map((feature) => (
          <label key={feature} className="checkbox-label">
            <input
              type="checkbox"
              checked={features.includes(feature)}
              onChange={() => handleFeatureToggle(feature)}
            />
            {feature}
          </label>
        ))}
      </div>
    </div>
  );
}
