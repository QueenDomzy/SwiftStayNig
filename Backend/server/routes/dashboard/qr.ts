// server/routes/dashboard/qr.ts
import { Router, Request, Response } from "express";
import QRCode from "qrcode";

const router = Router();

// 📌 GET /api/dashboard/qr?target=... → Generate QR code for dashboard link
router.get("/qr", async (req: Request, res: Response) => {
  try {
    // Use query param ?target=... or fallback to env/default
    const target = (req.query.target as string) || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/dashboard";

    // Optionally protect this route with auth middleware
    // e.g., authenticateAdmin(req, res, next)

    // Generate QR code as Data URL
    const dataUrl = await QRCode.toDataURL(target, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 2,
    });

    // Cache headers for performance
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json({ dataUrl });
  } catch (err: any) {
    console.error("❌ Failed to generate QR:", err);
    res.status(500).json({ error: "Failed to generate QR" });
  }
});

export default router;
