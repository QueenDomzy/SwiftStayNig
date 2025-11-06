// server/services/[id].ts
import { Router, Request, Response } from "express";

const router = Router();

// In-memory store (demo purposes, replace with DB in production)
let SERVICES_REF: Record<string, any> = {};

/* ----------------------------
   GET /api/services/:id → Fetch service by ID
----------------------------- */
router.get("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Service id required" });

    // TODO: Replace with Prisma DB call
    // Example: const service = await prisma.service.findUnique({ where: { id: Number(id) } });

    res.status(501).json({ error: "Implement DB-backed GET" });
  } catch (err: any) {
    console.error("❌ Failed to fetch service:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ----------------------------
   PUT /api/services/:id → Update service by ID
----------------------------- */
router.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Service id required" });

    // TODO: Replace with DB update logic
    res.status(501).json({ error: "Implement DB-backed UPDATE" });
  } catch (err: any) {
    console.error("❌ Failed to update service:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ----------------------------
   DELETE /api/services/:id → Delete service by ID
----------------------------- */
router.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Service id required" });

    // TODO: Replace with DB delete logic
    res.status(501).json({ error: "Implement DB-backed DELETE" });
  } catch (err: any) {
    console.error("❌ Failed to delete service:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ----------------------------
   Handle unsupported methods
----------------------------- */
router.all("/:id", (_req: Request, res: Response) => {
  res.setHeader("Allow", "GET,PUT,DELETE");
  res.status(405).end("Method Not Allowed");
});

export default router;
