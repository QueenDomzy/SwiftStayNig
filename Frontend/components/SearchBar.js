export default function SearchBar() {
  return (
    <div className="flex gap-4 justify-center mb-6">
      <input type="text" placeholder="Location" className="border p-2 rounded w-1/3" />
      <input type="number" placeholder="Max Price" className="border p-2 rounded w-1/4" />
      <button className="bg-blue-600 text-white px-6 py-2 rounded">Search</button>
    </div>
  );
}
