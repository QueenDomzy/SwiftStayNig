// frontend/pages/properties.js
import { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

    useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/properties`
        );
        setProperties(res.data);
      } catch (err) {
        console.error("❌ Failed to load properties:", err);
        setError("Failed to load properties. Please try again later.");
      }
    };

    fetchProperties();
  }, []);

  if (error) {
    return <p className="text-red-600 text-center mt-6">{error}</p>;
  }

  if (!properties.length) {
    return <p className="text-gray-500 text-center mt-6">No properties found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {properties.map((p) => (
        <PropertyCard key={p.id || p._id} property={p} />
      ))}
    </div>
  );
}
