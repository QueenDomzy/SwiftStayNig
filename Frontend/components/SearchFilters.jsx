// components/SearchFilters.jsx
import React, { useState } from "react";

export default function SearchFilters({ onChange }) {
  const [filters, setFilters] = useState({
    city: "",
    propertyType: "",
    abnbOnly: false,
    guests: 1,
    checkIn: "",
    checkOut: ""
  });

  function update(changes) {
    const next = { ...filters, ...changes };
    setFilters(next);
    onChange && onChange(next);
  }

  return (
    <div className="search-filters p-4">
      <input placeholder="City" value={filters.city} onChange={e=>update({city: e.target.value})} className="input" />
      <div className="mt-2">
        <label>
          <input type="checkbox" checked={filters.abnbOnly} onChange={e=>update({abnbOnly: e.target.checked})} /> ABnB only
        </label>
      </div>
      <select value={filters.propertyType} onChange={e=>update({propertyType: e.target.value})} className="mt-2">
        <option value="">Any type</option>
        <option value="APARTMENT">Apartment</option>
        <option value="HOME">Home</option>
        <option value="TREEHOUSE">Treehouse</option>
        <option value="CASTLE">Castle</option>
        <option value="ABnB">ABnB</option>
      </select>
      <div className="mt-2">
        <input type="date" value={filters.checkIn} onChange={e=>update({checkIn: e.target.value})} />
        <input type="date" value={filters.checkOut} onChange={e=>update({checkOut: e.target.value})} className="ml-2" />
      </div>
      <div className="mt-2">
        <label>Guests</label>
        <input type="number" min="1" value={filters.guests} onChange={e=>update({guests: Number(e.target.value)})} className="ml-2 w-20" />
      </div>
    </div>
  );
}
