// server/routes/dashboard/qr.ts
import type { NextApiRequest, NextApiResponse } from "next";
import QRCode from "qrcode";

type Data = { dataUrl: string } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    // Use a query param ?target=... or fallback to environment variable
    const target = (req.query.target as string) || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/dashboard";

    // Optionally protect with auth here (check headers / cookies)
    // if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

    const dataUrl = await QRCode.toDataURL(target, { errorCorrectionLevel: "H", type: "image/png", margin: 2 });
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json({ dataUrl });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate QR" });
  }
}
