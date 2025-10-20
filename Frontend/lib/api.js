const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const fetchProperties = async () => {
  const res = await fetch(`${API_BASE}/api/properties`);
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
};
