import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

/**
 * 🔒 authenticateUser Middleware
 * Verifies JWT, attaches user data to req.user, and passes control.
 */
export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Expected format: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("❌ JWT_SECRET not found in .env");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const decoded = jwt.verify(token, secret) as JwtPayload & {
      id: string | number;
      email: string;
    };

    req.user = {
      id: Number(decoded.id),
      email: decoded.email,
    };

    next(); // ✅ Continue to the next middleware or route
  } catch (err) {
    console.error("⚠️ JWT verification failed:", err);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
