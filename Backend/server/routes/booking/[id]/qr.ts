import type { NextApiRequest, NextApiResponse } from "next";
import QRCode from "qrcode";

type Data = { dataUrl: string } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Booking id required" });

    // Build the booking confirmation URL (frontend route)
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const bookingUrl = `${base}/booking/confirmation/${encodeURIComponent(String(id))}`;

    // You can sign this URL or embed a token if you want temporary access
    const dataUrl = await QRCode.toDataURL(bookingUrl, { errorCorrectionLevel: "M", type: "image/png", margin: 2 });

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json({ dataUrl });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate booking QR" });
  }
}
