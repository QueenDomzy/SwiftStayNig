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
        const text = await res.text();

        console.log('Backend response:', text); // For debugging

        if (!text) {
          setProperties([]);
          console.warn('Empty response from backend.');
        } else {
          try {
            setProperties(JSON.parse(text));
          } catch (parseErr) {
            console.error('Failed to parse JSON:', parseErr);
            setProperties([]);
            setError('Received invalid data from server.');
          }
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
