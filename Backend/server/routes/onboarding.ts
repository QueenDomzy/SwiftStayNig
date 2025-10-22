// server/routes/onboarding.ts
import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Interface for request body
interface OnboardingRequestBody {
  name: string;
  email: string;
  preferences?: string[];
}

/* POST /api/onboarding */
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("preferences").optional().isArray(),
  ],
  async (req: Request<{}, {}, OnboardingRequestBody>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, preferences } = req.body;

      // Example: replace with your Prisma / DB logic
      console.log("Onboarding data:", { name, email, preferences });

      res.status(201).json({
        message: "Onboarding complete",
        user: { name, email, preferences },
      });
    } catch (error: unknown) {
      console.error("Onboarding error:", error);
      res.status(500).json({
        message: "Server error",
        details: error instanceof Error ? error.message : undefined,
      });
    }
  }
);

export default router;
