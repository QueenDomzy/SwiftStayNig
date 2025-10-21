// server/utils/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

/**
 * Middleware to validate request body using a Zod schema
 * @param schema - Zod schema to validate req.body
 */
export const validateBody = <T extends ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessages = result.error.errors.map((e) => e.message);
      return res.status(400).json({ error: errorMessages.join(", ") });
    }

    // Replace body with validated data
    req.body = result.data;
    next();
  };
};
