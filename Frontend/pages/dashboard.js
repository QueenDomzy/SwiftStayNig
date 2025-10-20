import { useEffect, useState } from "react";
import { generateQR } from "@/utils/generateQR";

export default function Dashboard() {
  const [qr, setQr] = useState("");

  useEffect(() => {
    // Example: dynamic QR link for hotel onboarding
    generateQR("https://swiftstaynigeria-frontend.onrender.com/onboard?ref=hotel123")
      .then(setQr);
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Your Hotel QR Code</h1>
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
        Scan to onboard or share with guests
      </p>
    </div>
  );
}
