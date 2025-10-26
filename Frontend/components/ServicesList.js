// components/ServicesList.js
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

function ServiceCard({ s }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, maxWidth: 420 }}>
      <h3>{s.title}</h3>
      <p>{s.location} • ₦{s.pricePerNight}</p>
      <p>{s.description}</p>
      <div>
        {s.amenities?.map((a) => (
          <span key={a} style={{ marginRight: 6, fontSize: 12 }}>{a}</span>
        ))}
      </div>
    </div>
  );
}

export default function ServicesList() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((j) => setServices(j.services || []));
  }, []);

  return (
    <div>
      <SearchBar onResults={(rs) => setServices(rs)} />
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {services.map((s) => (
          <ServiceCard key={s.id} s={s} />
        ))}
      </div>
    </div>
  );
}
