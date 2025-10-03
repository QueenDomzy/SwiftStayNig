import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = Router();

// Utility to exclude password before sending user object
function excludePassword(user: any) {
  const { password, ...rest } = user;
  return rest;
}

// ========================
// User Registration
// ========================
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({ error: "Email, password, and role are required" });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed, role },
    });

    res.status(201).json(excludePassword(user));
  } catch (err: any) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// ========================
// User Login
// ========================
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Fail-safe: JWT secret must be set in production
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.warn("⚠️ JWT_SECRET not set. Using fallback for development only.");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      secret || "dev_fallback_secret",
      { expiresIn: "7d" }
    );

    res.json({ token, user: excludePassword(user) });
  } catch (err: any) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
