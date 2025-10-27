// server/routes/ads/[id].ts
import { Router, Request, Response } from "express";

const router = Router();

// 📌 GET /api/ads/:id → Fetch ad by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Ad ID required" });
    }

    // TODO: Replace with actual DB call using Prisma
    // Example: const ad = await prisma.ad.findUnique({ where: { id: Number(id) } });

    // For now, return placeholder response
    res.status(501).json({ error: "Replace with DB-backed implementation" });
  } catch (err: any) {
    console.error("❌ Failed to fetch ad:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
