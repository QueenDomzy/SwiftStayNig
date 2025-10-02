import Link from 'next/link';

export default function PropertyCard({ id, name, price, location }) {
  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <h3 className="text-xl font-bold">{name}</h3>
      <p>{location}</p>
      <p className="text-green-600 font-semibold">₦{price.toLocaleString()}</p>
      <Link href={`/property/${id || 1}`} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 inline-block">View Details</Link>
    </div>
  );
}
