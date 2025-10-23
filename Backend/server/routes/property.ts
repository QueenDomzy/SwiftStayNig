// server/routes/onboarding.ts
import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { isWebUri } from "valid-url";

const router = express.Router();

// Interface for request body
interface OnboardingRequestBody {
  name: string;
  email: string;
  preferences?: string[];
  website?: string; // optional URL field
}

/* POST /api/onboarding */
router.post(
  "/",
  [
    // Name must not be empty
    body("name").custom((value) => {
      if (typeof value !== "string" || value.trim() === "") {
        throw new Error("Name is required");
      }
      return true;
    }),

    // Custom email validator
    body("email").custom((value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value !== "string" || !emailRegex.test(value)) {
        throw new Error("Valid email required");
      }
      return true;
    }),

    // Preferences must be an array if provided
    body("preferences").optional().custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error("Preferences must be an array");
      }
      return true;
    }),

    // Optional website URL validation using valid-url
    body("website").optional().custom((value) => {
      if (!isWebUri(value)) {
        throw new Error("Invalid URL");
      }
      return true;
    }),
  ],
  async (req: Request<{}, {}, OnboardingRequestBody>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, preferences, website } = req.body;

      // Example: replace with your Prisma / DB logic
      console.log("Onboarding data:", { name, email, preferences, website });

      res.status(201).json({
        message: "Onboarding complete",
        user: { name, email, preferences, website },
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
