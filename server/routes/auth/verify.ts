import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();

/* ------------------------------------------
   🧩 Extend Express Request type to include user
------------------------------------------- */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: number;
        email: string;
        role?: string;
        full_name?: string;
      };
    }
  }
}

/* ------------------------------------------
   🛡️ Middleware: Authenticate Token
------------------------------------------- */
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded as JwtPayload & { id: number; email: string };
    next();
  } catch (err) {
    console.error("❌ Invalid or expired token:", err);
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

/* ------------------------------------------
   ✅ VERIFY USER ROUTE
------------------------------------------- */
router.get("/verify", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: No user info in token",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, full_name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("❌ Verify route error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
