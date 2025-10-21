import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

/**
 * @route   POST /api/onboarding
 * @desc    Collect onboarding info for a new user
 * @access  Public or Protected (depends on your logic)
 */
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("preferences").optional().isArray(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, preferences } = req.body;

      // Example logic: save onboarding data (replace with Prisma or DB logic)
      console.log("Onboarding data:", { name, email, preferences });

      res.status(201).json({
        message: "Onboarding complete",
        user: { name, email, preferences },
      });
    } catch (error) {
      console.error("Onboarding error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
