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
router.post(
  "/register",
  validateBody(registerSchema),
  async (req: Request<{}, {}, z.infer<typeof registerSchema>>, res: Response) => {
    try {
      const { full_name, email, password, role } = req.body;

      // Check for existing user
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: { full_name, email, password: hashedPassword, role },
        select: { id: true, email: true, role: true, full_name: true },
      });

      // Dynamic message per role
      let message = "";
      if (role === "hotel")
        message = `🏨 Your hotel account has been successfully registered. Welcome, ${user.full_name}! Access your hotel dashboard and QR tools.`;
      else if (role === "admin")
        message = `👑 Admin account created successfully for SwiftStay Nigeria. Welcome, ${user.full_name}! Manage SwiftStay operations.`;
      else
        message = `🧳 Guest account registered successfully. Welcome, ${user.full_name}! Browse and book your next stay.`;

      res.status(201).json({ message, user });
    } catch (err: unknown) {
      console.error("Register error:", err);
      res.status(500).json({
        error: "Failed to register user.",
        details: err instanceof Error ? err.message : undefined,
      });
    }
  }
);


export default router;

