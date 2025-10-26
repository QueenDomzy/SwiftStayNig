// server/routes/user.ts
import { Router, Request, Response } from "express";

const router = Router();

/**
 * 🧍‍♂️ Get Profile
 * Protected route — requires authentication middleware that sets req.user
 */
router.get("/profile", (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({
    id: req.user.id,
    email: req.user.email,
  });
});

export default router;
