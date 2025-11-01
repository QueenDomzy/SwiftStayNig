// server/routes/user.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/**
 * 🧍‍♂️ Get Logged-In User Profile
 * Requires authentication middleware to set req.user
 */
router.get("/profile", async (req: Request, res: Response) => {
  try {
    // @ts-ignore - user added via middleware
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // @ts-ignore
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Failed to fetch user profile:", error);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

export default router;
