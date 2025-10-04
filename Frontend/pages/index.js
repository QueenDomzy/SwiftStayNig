// pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`);
        const text = await res.text(); // Read response as text first

        if (!text) {
          setProperties([]); // Empty array if response is empty
        } else {
          setProperties(JSON.parse(text)); // Parse JSON if valid
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
        setError('Could not load properties at the moment.');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Properties</h1>
      {properties.length === 0 ? (
        <p>No properties available.</p>
      ) : (
        <ul>
          {properties.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
