import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { validateBody } from "../../middleware/validate";

const prisma = new PrismaClient();
const router = Router();

/* 🧾 Zod schema for validation */
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/* 🔐 LOGIN ROUTE */
router.post(
  "/login",
  validateBody(loginSchema),
  async (req: Request<{}, {}, z.infer<typeof loginSchema>>, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password." });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ error: "Invalid email or password." });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      // Role-based welcome message
      let message = "";
      if (user.role === "hotel")
        message = `🏨 Welcome, ${user.full_name}! Access your hotel dashboard and QR tools.`;
      else if (user.role === "admin")
        message = `👑 Welcome back, Superadmin (${user.full_name}) — manage SwiftStay operations.`;
      else
        message = `🧳 Welcome, ${user.full_name}! Browse and book your next stay.`;

      res.json({
        message,
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
      });
    } catch (err: unknown) {
      console.error("Login error:", err);
      res.status(500).json({
        error: "Failed to login.",
        details: err instanceof Error ? err.message : undefined,
      });
    }
  }
);

export default router;

