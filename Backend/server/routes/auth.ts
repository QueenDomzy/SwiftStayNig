import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { validateBody } from "../middleware/validate";

const prisma = new PrismaClient();
const router = Router();

/* 🩵 Route Health Check */
router.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "🧩 Auth routes active",
    routes: ["/register", "/login", "/me"],
  });
});

/* 🧾 Zod Schemas */
const registerSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().optional().default("user"), // ✅ made optional
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/* 🧾 User Registration */
router.post(
  "/register",
  validateBody(registerSchema),
  async (req: Request<{}, {}, z.infer<typeof registerSchema>>, res: Response) => {
    try {
      const { full_name, email, password, role } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: { full_name, email, password: hashedPassword, role },
        select: { id: true, email: true, role: true, full_name: true },
      });

      res.status(201).json({
        message: "✅ Registration successful.",
        user,
      });
    } catch (err: unknown) {
      console.error("Register error:", err);
      res.status(500).json({
        error: "Failed to register user.",
        details: err instanceof Error ? err.message : undefined,
      });
    }
  }
);

/* 🔐 User Login */
router.post(
  "/login",
  validateBody(loginSchema),
  async (req: Request<{}, {}, z.infer<typeof loginSchema>>, res: Response) => {
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

      const secret = process.env.JWT_SECRET || "swiftstay_default_secret";
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
        },
        secret,
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
        error: "Login failed.",
        details: err instanceof Error ? err.message : undefined,
      });
    }
  }
);

/* 👤 Get Current User (Protected) */
import { authenticateUser } from "../middleware/auth";

router.get("/me", authenticateUser, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, role: true, full_name: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ user });
  } catch (err: unknown) {
    console.error("Get user error:", err);
    res.status(500).json({
      error: "Failed to fetch user info.",
      details: err instanceof Error ? err.message : undefined,
    });
  }
});

export default router;
