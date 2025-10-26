import type { JwtPayload } from "jsonwebtoken"; // ✅ type-only import

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

export {}; // ✅ required for TypeScript to treat this as a module
