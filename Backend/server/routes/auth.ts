import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import { authenticateUser, AuthenticatedRequest } from "../middleware/auth"; // ensure middleware exists

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
  role: z.string().optional().default("user"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/* 🧾 REGISTER USER */
router.post(
  "/register",
  validateBody(registerSchema),
  async (req: Request<{}, {}, z.infer<typeof registerSchema>>, res: Response) => {
    try {
      const { full_name, email, password, role } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ error: "User already exists." });

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { full_name, email, password: hashedPassword, role },
        select: { id: true, full_name: true, email: true, role: true },
      });

      // generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      res.status(201).json({ message: "Registration successful", token, user });
    } catch (err: unknown) {
      console.error("Register error:", err);
      res.status(500).json({
        error: "Failed to register user",
        details: err instanceof Error ? err.message : undefined,
      });
    }
  }
);

/* 🔐 LOGIN USER */
router.post(
  "/login",
  validateBody(loginSchema),
  async (req: Request<{}, {}, z.infer<typeof loginSchema>>, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ error: "Invalid email or password" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ error: "Invalid email or password" });

      const token = jwt.sign(
        { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
      });
    } catch (err: unknown) {
      console.error("Login error:", err);
      res.status(500).json({
        error: "Failed to login",
        details: err instanceof Error ? err.message : undefined,
      });
    }
  }
);

/* 👤 GET CURRENT USER (Protected) */
router.get("/me", authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, full_name: true, email: true, role: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err: unknown) {
    console.error("Fetch user error:", err);
    res.status(500).json({
      error: "Failed to fetch user",
      details: err instanceof Error ? err.message : undefined,
    });
  }
});

export default router;
