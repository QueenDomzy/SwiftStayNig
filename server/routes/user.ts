import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.get("/profile", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, role: true, full_name: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("❌ Failed to fetch profile:", error);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

export default router;
