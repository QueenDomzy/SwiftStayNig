// server/routes/onboarding.ts
import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Interface for request body
interface OnboardingRequestBody {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  price: string | number;
  images?: string[];
}

/* GET /api/onboarding → Test route */
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Onboarding route works" });
});

/* POST /api/onboarding */
router.post(
  "/",
  [
    // Name must not be empty
    body("name").notEmpty().withMessage("Name is required"),

    // Email must be valid
    body("email").isEmail().withMessage("Valid email required"),

    // Phone must not be empty
    body("phone").notEmpty().withMessage("Phone number is required"),

    // Location must not be empty
    body("location").notEmpty().withMessage("Location is required"),

    // Description must not be empty
    body("description").notEmpty().withMessage("Description is required"),

    // Price must not be empty and numeric
    body("price").notEmpty().withMessage("Price is required").isNumeric().withMessage("Price must be a number"),

    // Images must be an array if provided
    body("images").optional().isArray().withMessage("Images must be an array"),
  ],
  async (req: Request<{}, {}, OnboardingRequestBody>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, location, description, price, images } = req.body;

      // Example: replace with your Prisma / DB logic
      console.log("Onboarding data:", { name, email, phone, location, description, price, images });

      res.status(201).json({
        message: "Onboarding complete",
        user: { name, email, phone, location, description, price, images },
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
