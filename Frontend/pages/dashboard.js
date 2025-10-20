import { useEffect, useState } from "react";
import { generateQR } from "@/utils/generateQR";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (!user) return;

    // Create a unique onboarding link per hotel
    const link = `https://swiftstaynigeria-frontend.onrender.com/onboard?ref=${user.id}`;
    generateQR(link).then(setQr);
  }, [user]);

  if (!user)
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl text-gray-700">Please log in to view your dashboard.</h1>
      </div>
    );

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>

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
