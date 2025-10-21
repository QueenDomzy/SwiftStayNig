import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = Router();

// User registration
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, full_name } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({ error: "Email, password, and role are required" });
      return;
    }

    if (!full_name) {
      res.status(400).json({ error: "Full name is required" });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed, role, full_name },
    });

    res.json(user);
  } catch (error: unknown) {
    // Narrow unknown type safely
    if (error instanceof Error) {
      console.error("Register error:", error.message);
      res.status(500).json({ error: "Failed to register user", details: error.message });
    } else {
      console.error("Register unknown error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  }
});

// User login
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

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (error: unknown) {
    // Narrow unknown type safely
    if (error instanceof Error) {
      console.error("Login error:", error.message);
      res.status(500).json({ error: "Login failed", details: error.message });
    } else {
      console.error("Login unknown error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  }
});

export default router;
