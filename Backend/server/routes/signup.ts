import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { validateBody } from "../../middleware/validate";

const prisma = new PrismaClient();
const router = Router();

/* 🧾 Schema */
const registerSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().optional().default("user"),
});

/* 🧩 REGISTER ROUTE */
router.post(
  "/register",
  validateBody(registerSchema),
  async (req: Request, res: Response) => {
    try {
      const { full_name, email, password, role } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: { full_name, email, password: hashedPassword, role },
        select: { id: true, full_name: true, email: true, role: true },
      });

      // Optionally generate token immediately
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        message: "Registration successful",
        token,
        user,
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({
        error: "Internal server error during registration",
        details: error instanceof Error ? error.message : error,
      });
    }
  }
);

export default router;
