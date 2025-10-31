// server/routes/booking/[id]/qr.ts
import { Router, Request, Response } from "express";
import QRCode from "qrcode";

const router = Router();

// 📌 GET /api/booking/:id/qr → Generate booking QR code
router.get("/:id/qr", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Booking ID required" });
    }

    // Build the booking confirmation URL (frontend route)
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const bookingUrl = `${base}/booking/confirmation/${encodeURIComponent(id)}`;

    // Generate QR code as data URL
    const dataUrl = await QRCode.toDataURL(bookingUrl, {
      errorCorrectionLevel: "M",
      type: "image/png",
      margin: 2,
    });

    // Optional caching headers
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json({ dataUrl });
  } catch (err: any) {
    console.error("❌ Failed to generate booking QR:", err);
    res.status(500).json({ error: "Failed to generate booking QR" });
  }
});

export default router;
