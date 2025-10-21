import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

/* 🩵 Route Health Check */
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "🧩 Auth routes active",
    routes: ["/register", "/login"],
  });
});

/* 🧾 User Registration */
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, full_name } = req.body;

    if (!email || !password || !role || !full_name) {
      res.status(400).json({
        error: "Email, password, full name, and role are required.",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role, full_name },
      select: { id: true, email: true, role: true, full_name: true },
    });

    res.status(201).json({
      message: "✅ Registration successful.",
      user,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Register error:", error.message);
      res.status(500).json({
        error: "Failed to register user",
        details: error.message,
      });
    } else {
      console.error("Unknown register error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  }
});

/* 🔐 User Login */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid credentials." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials." });
      return;
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
      res.status(500).json({
        error: "Login failed",
        details: error.message,
      });
    } else {
      console.error("Unknown login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  }
});

export default router;
