// server/routes/property.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import rateLimit from "express-rate-limit";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

/* 🧱 Rate limiting */
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: "Too many requests, please try again later." },
});
router.use(limiter);

/* 🧹 Centralized error handler */
const handleError = (res: Response, error: unknown, message = "Server error") => {
  console.error(message, error);
  res.status(500).json({
    error: message,
    details: error instanceof Error ? error.message : undefined,
  });
};

/* 🧾 Zod schema for property creation */
const createPropertySchema = z.object({
  title: z.string().min(2),
  propertyName: z.string().min(2),
  location: z.string().min(2),
  price: z.number().gt(0),
  pricePerNight: z.number().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  ownerId: z.number(),
  hostId: z.number().optional(),
});

/* ✅ Create a property */
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = createPropertySchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => issue.message);
      return res.status(400).json({ errors: errorMessages });
    }

    const { 
      title, 
      propertyName, 
      location, 
      price, 
      pricePerNight, 
      description, 
      images, 
      ownerId, 
      hostId 
    } = parsed.data;

    const property = await prisma.property.create({
      data: {
        title,
        propertyName,  // ✅ match schema field
        location,
        price,
        pricePerNight,
        description: description ?? null,
        images: images ?? [],
        ownerId,
        ...(hostId ? { hostId } : {}),
      },
      include: {
        owner: true,
        host: true,
        bookings: true,
        reviews: true,
      },
    });

    res.status(201).json({
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    handleError(res, error, "Failed to create property");
  }
});

/* ✅ Get all properties */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        owner: true,
        host: true,
        bookings: true,
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ count: properties.length, data: properties });
  } catch (error) {
    handleError(res, error, "Failed to fetch properties");
  }
});

/* ✅ Get property by ID */
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const propertyId = Number(req.params.id);
  if (isNaN(propertyId) || propertyId <= 0) {
    return res.status(400).json({ error: "Invalid property ID" });
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        owner: true,
        host: true,
        bookings: true,
        reviews: true,
      },
    });
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    handleError(res, error, "Failed to fetch property");
  }
});

/* ✅ Delete property */
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const propertyId = Number(req.params.id);
  if (isNaN(propertyId) || propertyId <= 0) {
    return res.status(400).json({ error: "Invalid property ID" });
  }

  try {
    await prisma.property.delete({ where: { id: propertyId } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error, "Failed to delete property");
  }
});

export default router;
