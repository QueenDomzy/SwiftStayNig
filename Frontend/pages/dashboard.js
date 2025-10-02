import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to access the dashboard</p>;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>This is your dashboard.</p>
    </div>
  );
}
