import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';

export default function Home({ properties }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">SwiftStay Nigeria</h1>
        <nav>
          <Link href="/properties" className="mr-4">Explore</Link>
          <Link href="/auth/login">Login</Link>
        </nav>
      </header>

      <main className="p-8">
        <section className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-4">
            💼 From busy cities to quiet towns, SwiftStay connects Nigeria — one stay at a time.
          </h2>
          <div className="flex justify-center gap-4">
            <Link href="/properties" className="bg-blue-600 text-white px-6 py-3 rounded-lg">Explore Prototype</Link>
            <Link href="/booking/1" className="bg-green-600 text-white px-6 py-3 rounded-lg">Book a Stay</Link>
          </div>
        </section>

        <SearchBar />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              name={property.name}
              price={property.price}
              location={property.location}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

// Fetch properties from your backend API
export async function getServerSideProps() {
  const res = await fetch('https://your-backend.com/api/properties'); // Replace with your API URL
  const properties = await res.json();

  return {
    props: {
      properties,
    },
  };
}
