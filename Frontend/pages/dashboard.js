// pages/dashboard.js
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { generateQR } from "../utils/generateQR";

export default function Dashboard() {
  const { user } = useAuth();
  const [qr, setQr] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // 1️⃣ Generate QR code for property owner
    if (user.role === "owner") {
      const link = `https://swiftstaynigeria-frontend.onrender.com/onboard?ref=${user.id || user.email}`;
      (async () => {
        const qrCode = await generateQR(link);
        setQr(qrCode);
      })();
    }

    // 2️⃣ Fetch dashboard data from backend
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${user.token}`, // adjust if using JWT/session
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
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

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  // ---------- Admin Dashboard ----------
  if (user.role === "admin") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-700 mb-4">Welcome, {user.name || user.email}!</p>

        {/* Example stats from backend */}
        {dashboardData ? (
          <div className="space-y-4">
            <p>Total Users: {dashboardData.totalUsers}</p>
            <p>Total Properties: {dashboardData.totalProperties}</p>
            <p>Active Bookings: {dashboardData.activeBookings}</p>
          </div>
        ) : (
          <p className="text-gray-600">No data available</p>
        )}
      </div>
    );
  }

  // ---------- Owner Dashboard ----------
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

        {/* Optional backend data */}
        {dashboardData && (
          <div className="mt-4 text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">Your Stats:</h3>
            <p>Total Properties: {dashboardData.totalProperties}</p>
            <p>Total Bookings: {dashboardData.totalBookings}</p>
          </div>
        )}
      </div>
    );
  }

  // ---------- Guest Dashboard ----------
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
