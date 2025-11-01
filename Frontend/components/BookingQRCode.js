// components/BookingQRCode.js
import { useEffect, useState } from "react";

export default function BookingQRCode({ bookingId }) {
  const [dataUrl, setDataUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/qr`);
        if (!res.ok) throw new Error("Failed to fetch QR");
        const json = await res.json();
        if (mounted) setDataUrl(json.dataUrl);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [bookingId]);

  if (loading) return <div>Loading QR…</div>;
  if (!dataUrl) return <div>No QR available</div>;
  return (
    <div style={{ maxWidth: 220 }}>
      <img alt={`Booking ${bookingId} QR`} src={dataUrl} style={{ width: "100%", height: "auto" }} />
    </div>
  );
}
