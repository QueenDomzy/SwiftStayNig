// components/DashboardQRCode.js
import { useEffect, useState } from "react";

export default function DashboardQRCode({ targetUrl }) {
  const [dataUrl, setDataUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const url = `/api/dashboard/qr${targetUrl ? `?target=${encodeURIComponent(targetUrl)}` : ""}`;
        const res = await fetch(url);
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
  }, [targetUrl]);

  if (loading) return <div>Loading QR…</div>;
  if (!dataUrl) return <div>Unable to generate QR</div>;
  return (
    <div style={{ maxWidth: 240 }}>
      <img alt="Dashboard QR" src={dataUrl} style={{ width: "100%", height: "auto" }} />
    </div>
  );
}
