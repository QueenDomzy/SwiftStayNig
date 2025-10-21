// pages/dashboard.js
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // relative path
import { generateQR } from "../utils/generateQR"; // named export

export default function Dashboard() {
  const { user } = useAuth();
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (!user) return;

    // Create a unique onboarding link per hotel
    const link = `https://swiftstaynigeria-frontend.onrender.com/onboard?ref=${user.id || user.email}`;
    
    // Generate QR code and set state
    (async () => {
      const qrCode = await generateQR(link);
      setQr(qrCode);
    })();
  }, [user]);

  // Show login prompt if user is not logged in
  if (!user)
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl text-gray-700">
          Please log in to view your dashboard.
        </h1>
      </div>
    );

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name || user.email}</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Hotel QR Code</h2>
        {qr ? (
          <img
            src={qr}
            alt="Hotel QR"
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
