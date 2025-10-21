// server/routes/auth.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { validateBody } from "../utils/validate";

const prisma = new PrismaClient();
const router = Router();

/* 🩵 Route Health Check */
router.get("/", (_req, res) => {
  res.json({
    message: "🧩 Auth routes active",
    routes: ["/register", "/login"],
  });
});

/* 🧾 Zod Schemas */
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().min(1),
  full_name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/* 🧾 User Registration */
router.post("/register", validateBody(registerSchema), async (req, res) => {
  try {
    const { email, password, role, full_name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role, full_name },
      select: { id: true, email: true, role: true, full_name: true },
    });

    res.status(201).json({
      message: "✅ Registration successful.",
      user,
    });
  } catch (err: unknown) {
    console.error("Register error:", err);
    res.status(500).json({
      error: "Failed to register user",
      details: err instanceof Error ? err.message : undefined,
    });
  }
});

/* 🔐 User Login */
router.post("/login", validateBody(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "✅ Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
    });
  } catch (err: unknown) {
    console.error("Login error:", err);
    res.status(500).json({
      error: "Login failed",
      details: err instanceof Error ? err.message : undefined,
    });
  }
});

export default router;
