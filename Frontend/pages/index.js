import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';

export default function Home({ properties }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">SwiftStay Nigeria</h1>
        <nav>
          <Link href="/properties" className="mr-4">Explore</Link>
          <Link href="/auth/login">Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="p-8">
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Welcome to SwiftStay Nigeria
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Book hotels and short stays seamlessly
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/properties"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              Book a Stay
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* SearchBar */}
        <SearchBar />

        {/* Dynamic Property Listings */}
        {properties.length > 0 && (
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
        )}
      </main>
    </div>
  );
}

// Fetch properties from your backend API
export async function getServerSideProps() {
  const res = await fetch('https://swiftstaynigeria-ua1e.onrender.com/api/properties'); // Replace with your API URL
  const properties = await res.json();    

  return {
    props: {
      properties,
    },
  };
}
