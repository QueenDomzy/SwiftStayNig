// frontend/pages/properties.js
import { useEffect, useState } from "react";
import api from "../utils/api";
import PropertyCard from "../components/PropertyCard";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("/properties");
        // Defensive: Ensure it's always an array
        const data = Array.isArray(res.data) ? res.data : [];
        setProperties(data);
      } catch (err) {
        console.error("❌ Failed to load properties:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading properties...</div>;

  if (error)
    return <div className="p-8 text-center text-red-500">{error}</div>;

  if (!properties.length)
    return <div className="p-8 text-center text-gray-500">No properties found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {properties.map((p) => (
        <PropertyCard key={p.id || p._id} property={p} />
      ))}
    </div>
  );
      } 
