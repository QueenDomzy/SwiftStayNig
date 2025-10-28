import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as {
      id: string | number;
      email: string;
    };

    req.user = {
      id: Number(decoded.id),
      email: decoded.email,
    };

    // Instead of next(), just respond here if this middleware is the endpoint
    return res.status(200).json({
      message: "Token verified successfully",
      user: req.user,
    });
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
