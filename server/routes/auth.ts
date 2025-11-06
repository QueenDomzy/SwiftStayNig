import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

/* Health Check */
router.get("/", (_req, res) => {
  res.json({ message: "🧩 SwiftStay Auth routes active" });
});

/* Schemas */
const registerSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["guest", "hotel", "admin"]).optional().default("guest"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/* REGISTER */
router.post("/register", validateBody(registerSchema), async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User already exists." });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { full_name, email, password: hashed, role },
      select: { id: true, full_name: true, email: true, role: true },
    });

    const message =
      role === "hotel"
        ? `🏨 Hotel account registered. Welcome, ${user.full_name}!`
        : role === "admin"
        ? `👑 Admin account created for ${user.full_name}.`
        : `🧳 Guest account registered. Welcome, ${user.full_name}!`;

    res.status(201).json({ message, user });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message || "Failed to register user." });
  }
});

/* LOGIN */
router.post("/login", validateBody(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ error: "Invalid email or password." });

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

    const message =
      user.role === "hotel"
        ? `🏨 Welcome back, ${user.full_name}!`
        : user.role === "admin"
        ? `👑 Admin access granted for ${user.full_name}.`
        : `🧳 Welcome back, ${user.full_name}!`;

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
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message || "Failed to login." });
  }
});

/* CURRENT USER */
router.get("/me", authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, full_name: true, role: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      message: `👋 Welcome back, ${user.full_name} (${user.role})`,
      user,
    });
  } catch (err: any) {
    console.error("Fetch user error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch user" });
  }
});

export default router;
