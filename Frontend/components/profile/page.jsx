// components/profile/page.jsx
"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, verifySession, logout, loading } = useAuth();

  useEffect(() => {
    verifySession();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.full_name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
