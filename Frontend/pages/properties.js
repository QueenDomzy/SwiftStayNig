// frontend/pages/properties.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";

export async function getStaticProps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`);
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    const properties = await res.json();
    return { props: { initialProperties: properties }, revalidate: 600 };
  } catch (error) {
    console.error("❌ Failed to fetch properties:", error.message);
    return { props: { initialProperties: [] }, revalidate: 600 };
  }
}

export default function PropertiesPage({ initialProperties }) {
  const [properties, setProperties] = useState(initialProperties || []);
  const [error, setError] = useState("");

  useEffect(() => {
    // Revalidate client-side data after static generation
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Available Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <PropertyCard key={p.id || p._id} property={p} />
        ))}
      </div>
    </div>
  );
}

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
