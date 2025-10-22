// src/routes/property.ts
import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import rateLimit from "express-rate-limit";
import { body, param, validationResult } from "express-validator";

const prisma = new PrismaClient();
const router = Router();

/* 🧱 Rate limiting */
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: "Too many requests, please try again later." },
});
router.use(limiter);

/* 🧹 Error handler */
const handleError = (res: Response, error: unknown, message = "Server error") => {
  console.error(message, error);
  res.status(500).json({ error: message, details: error instanceof Error ? error.message : undefined });
};

/* ✅ Create a property */
router.post(
  "/",
  [
    body("name").isString().isLength({ min: 2 }).trim(),
    body("location").isString().isLength({ min: 2 }).trim(),
    body("price").isFloat({ gt: 0 }),
    body("description").optional().isString(),
    body("images").optional().isArray().custom(arr => arr.every((i: any) => typeof i === "string")),
    body("ownerId").optional().isInt(),
  ],
  async (
    req: Request<{}, {}, { name: string; location: string; price: number; description?: string; images?: string[]; ownerId?: number }>,
    res: Response
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, location, price, description, images, ownerId } = req.body;

    try {
      // Build Prisma data object
      const data = {
        name,
        location,
        price,
        description: description ?? null,
        images: images ?? [],
      } as const;

      // Create property with or without ownerId
      const property = ownerId
        ? await prisma.property.create({ data: { ...data, ownerId: ownerId as number } })
        : await prisma.property.create({ data });

      res.status(201).json({ message: "Property created successfully", data: property });
    } catch (error) {
      handleError(res, error, "Failed to create property");
    }
  }
);

/* ✅ Get all properties */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      include: { owner: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ count: properties.length, data: properties });
  } catch (error) {
    handleError(res, error, "Failed to fetch properties");
  }
});

/* ✅ Get property by ID */
router.get(
  "/:id",
  [param("id").isInt({ gt: 0 }).toInt()],
  async (req: Request<{ id: string }>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const propertyId = Number(req.params.id);

    try {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: { owner: true },
      });
      if (!property) return res.status(404).json({ error: "Property not found" });
      res.status(200).json(property);
    } catch (error) {
      handleError(res, error, "Failed to fetch property");
    }
  }
);

/* ✅ Delete property */
router.delete(
  "/:id",
  [param("id").isInt({ gt: 0 }).toInt()],
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const propertyId = Number(req.params.id);
      await prisma.property.delete({ where: { id: propertyId } });
      res.status(204).send();
    } catch (error) {
      handleError(res, error, "Failed to delete property");
    }
  }
);

export default router;
