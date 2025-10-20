// src/routes/propertyRoutes.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import rateLimit from "express-rate-limit";
import { body, param, validationResult } from "express-validator";

const prisma = new PrismaClient();
const router = Router();

/* 🧱  Rate limiting to prevent abuse (esp. 429 Too Many Requests) */
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per minute
  message: { error: "Too many requests, please try again later." },
});

router.use(limiter);

/* 🧹 Utility for error handling */
const handleError = (res: Response, error: any, message = "Server error") => {
  console.error(message, error);
  res.status(500).json({ error: message });
};

/* ✅ Add a property (POST /api/properties)
   Used by hotels during onboarding */
router.post(
  "/",
  [
    body("name").isString().isLength({ min: 2 }).trim(),
    body("location").isString().isLength({ min: 2 }).trim(),
    body("price").isFloat({ gt: 0 }),
    body("description").isString().optional(),
    body("images").isArray().optional(),
    body("ownerId").isInt().optional(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, location, price, description, images, ownerId } = req.body;

    try {
      const property = await prisma.property.create({
        data: { name, location, price, description, images, ownerId },
      });

      res.status(201).json({
        message: "Property created successfully",
        data: property,
      });
    } catch (error) {
      handleError(res, error, "Failed to create property");
    }
  }
);

/* ✅ Get all properties (GET /api/properties)
   Used by users on homepage or properties page */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      include: { owner: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch properties");
  }
});

/* ✅ Get property by ID (GET /api/properties/:id)
   Used when a user clicks a specific property */
router.get(
  "/:id",
  [param("id").isInt().toInt()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const propertyId = req.params.id as unknown as number;

    try {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: { owner: true },
      });

      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      res.status(200).json(property);
    } catch (error) {
      handleError(res, error, "Failed to fetch property");
    }
  }
);

/* 🧩 (Optional) Delete or Update property */
router.delete("/:id", [param("id").isInt().toInt()], async (req, res) => {
  try {
    await prisma.property.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error, "Failed to delete property");
  }
});

export default router;
