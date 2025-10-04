// pages/index.js
export default function Home({ properties, error }) {
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

// Fetch data server-side on every request
export async function getServerSideProps() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/properties';
  let properties = [];
  let error = null;

  try {
    const res = await fetch(apiUrl);
    const text = await res.text();

    if (!text) {
      properties = [];
      console.warn('Empty response from backend.');
    } else {
      try {
        properties = JSON.parse(text);
      } catch (parseErr) {
        console.error('Failed to parse JSON:', parseErr);
        error = 'Received invalid data from server.';
        properties = [];
      }
    }
  } catch (err) {
    console.error('Failed to fetch properties:', err);
    error = 'Could not load properties at the moment.';
    properties = [];
  }

  return {
    props: {
      properties,
      error,
    },
  };
        }
