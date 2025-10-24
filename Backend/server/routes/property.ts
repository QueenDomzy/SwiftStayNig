// server/routes/property.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import rateLimit from "express-rate-limit";
import { body, param, validationResult } from "express-validator";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

/* 🧱 Rate limiting */
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,             // max 20 requests per window per IP
  message: "Too many requests from this IP, please try again later.",
});

router.use(limiter);

/* 🧾 Zod schema for property creation */
const createPropertySchema = z.object({
  title: z.string().min(3),
  propertyName: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
  location: z.string(),
  images: z.array(z.string()).optional(),
  ownerId: z.number(),
});

type CreatePropertyRequest = z.infer<typeof createPropertySchema>;

/* ✅ Create property */
router.post("/", async (req: Request<{}, {}, CreatePropertyRequest>, res: Response) => {
  try {
    const parsed = createPropertySchema.safeParse(req.body);

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => issue.message);
      return res.status(400).json({ errors: errorMessages });
    }

    const { title, propertyName, description, price, location, ownerId, images} = parsed.data;

    const property = await prisma.property.create({
  data: {
    title,   // must match the Prisma model field
    propertyName,
    description,
    price,
    location,
    images,
    owner: { connect: { id: ownerId } }, // relation instead of scalar
  },
});

    res.status(201).json(property);
  } catch (err: unknown) {
    console.error("❌ Property creation failed:", err);
    res.status(500).json({
      error: "Failed to create property",
      details: err instanceof Error ? err.message : undefined,
    });
  }
});

/* ✅ Get all properties */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(properties);
  } catch (err: unknown) {
    console.error("❌ Failed to fetch properties:", err);
    res.status(500).json({
      error: "Failed to fetch properties",
      details: err instanceof Error ? err.message : undefined,
    });
  }
});

/* ✅ Get property by ID */
router.get("/:id", param("id").isInt(), async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const id = parseInt(req.params.id, 10);
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) return res.status(404).json({ error: "Property not found" });

    res.status(200).json(property);
  } catch (err: unknown) {
    console.error("❌ Failed to fetch property:", err);
    res.status(500).json({
      error: "Failed to fetch property",
      details: err instanceof Error ? err.message : undefined,
    });
  }
});

/* ✅ Update property */
router.put("/:id", param("id").isInt(), async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const id = parseInt(req.params.id, 10);
    const parsed = createPropertySchema.partial().safeParse(req.body); // partial allows partial updates

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => issue.message);
      return res.status(400).json({ errors: errorMessages });
    }

    const property = await prisma.property.update({
      where: { id },
      data: parsed.data,
    });

    res.status(200).json(property);
  } catch (err: unknown) {
    console.error("❌ Failed to update property:", err);
    res.status(500).json({
      error: "Failed to update property",
      details: err instanceof Error ? err.message : undefined,
    });
  }
});

/* ✅ Delete property */
router.delete("/:id", param("id").isInt(), async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const id = parseInt(req.params.id, 10);

    await prisma.property.delete({ where: { id } });

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err: unknown) {
    console.error("❌ Failed to delete property:", err);
    res.status(500).json({
      error: "Failed to delete property",
      details: err instanceof Error ? err.message : undefined,
    });
  }
});

export default router;
