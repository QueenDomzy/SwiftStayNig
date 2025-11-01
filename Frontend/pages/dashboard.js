// pages/dashboard.js
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { generateQR } from "../utils/generateQR";

export default function Dashboard() {
  const { user } = useAuth();
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (!user || user.role !== "owner") return;

    // Generate unique onboarding link for property owner
    const link = `https://swiftstaynigeria-frontend.onrender.com/onboard?ref=${user.id || user.email}`;

    (async () => {
      const qrCode = await generateQR(link);
      setQr(qrCode);
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl text-gray-700">
          Please log in to view your dashboard.
        </h1>
      </div>
    );
  }

  // Admin Dashboard
  if (user.role === "admin") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-700 mb-4">Welcome, {user.name || user.email}!</p>
        <div className="space-y-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded shadow">
            View All Users
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded shadow">
            Manage Properties
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded shadow">
            View Reports
          </button>
        </div>
      </div>
    );
  }

  // Owner Dashboard
  if (user.role === "owner") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {user.name || user.email}
        </h1>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Your Property QR Code</h2>
          {qr ? (
            <img
              src={qr}
              alt="Property QR"
              className="mx-auto border rounded-lg shadow-md"
            />
          ) : (
            <p>Generating QR...</p>
          )}
          <p className="mt-2 text-gray-600 text-sm">
            Scan to onboard your property or share with guests.
          </p>
        </div>
      </div>
    );
  }

  // Guest Dashboard
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user.name || user.email}
      </h1>
      <p className="text-gray-700 mb-4">
        Explore available properties and manage your bookings.
      </p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded shadow">
        Browse Properties
      </button>
      <button className="px-4 py-2 bg-green-600 text-white rounded shadow ml-2">
        My Bookings
      </button>
    </div>
  );
}
