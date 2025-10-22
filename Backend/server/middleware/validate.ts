import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError, ZodIssue } from "zod";

export const validateBody = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      // Explicitly type Zod issues
      const errorMessages = (result.error as ZodError<any>).issues.map((issue: ZodIssue) => issue.message);
      return res.status(400).json({ error: errorMessages });
    }
    next();
  };
};
