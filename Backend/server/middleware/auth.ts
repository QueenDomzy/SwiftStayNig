import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    full_name?: string;
    role?: string;
  };
}

// ✅ Middleware to authenticate users using JWT
export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Check for "Bearer <token>" header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. Token missing." });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "swiftstay_default_secret";

    // Verify JWT
    const decoded = jwt.verify(token, secret) as {
      id: string;
      email?: string;
      full_name?: string;
      role?: string;
      iat?: number;
      exp?: number;
    };

    // Attach decoded user info to the request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      full_name: decoded.full_name,
      role: decoded.role,
    };

    next();
  } catch (err: any) {
    console.error("❌ Auth Middleware Error:", err.message);
    return res.status(401).json({
      error: "Invalid or expired token. Please log in again.",
    });
  }
};
