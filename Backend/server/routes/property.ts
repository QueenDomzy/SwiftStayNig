// server/routes/property.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import rateLimit from "express-rate-limit";
import { param, validationResult } from "express-validator";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

/* 🧱 Rate Limiting */
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // max 20 requests per IP per minute
  message: "Too many requests from this IP, please try again later.",
});
router.use(limiter);

/* 🧾 Zod Schema for Property Creation/Update */
const propertySchema = z.object({
  title: z.string().min(3),
  propertyName: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
  location: z.string(),
  images: z.array(z.string()).optional(),
  ownerId: z.number(),
});

/* ==============================
   🏠 CREATE PROPERTY
================================ */
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = propertySchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message);
      return res.status(400).json({ errors });
    }

    const { title, propertyName, description, price, location, ownerId, images } = parsed.data;

    const property = await prisma.property.create({
      data: {
        title,
        propertyName,
        description,
        price,
        location,
        images,
        owner: { connect: { id: ownerId } },
      },
    });

    res.status(201).json(property);
  } catch (err) {
    console.error("❌ Property creation failed:", err);
    res.status(500).json({ error: "Failed to create property" });
  }
});

/* ==============================
   🏘️ GET ALL PROPERTIES
================================ */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });
    // ✅ Return array directly for clean frontend mapping
    res.status(200).json(properties);
  } catch (err) {
    console.error("❌ Failed to fetch properties:", err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

/* ==============================
   🏡 GET PROPERTY BY ID
================================ */
router.get("/:id", param("id").isInt(), async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const id = parseInt(req.params.id, 10);
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ error: "Property not found" });

    res.status(200).json(property);
  } catch (err) {
    console.error("❌ Failed to fetch property:", err);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

/* ==============================
   🧱 UPDATE PROPERTY
================================ */
router.put("/:id", param("id").isInt(), async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const id = parseInt(req.params.id, 10);
    const parsed = propertySchema.partial().safeParse(req.body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message);
      return res.status(400).json({ errors });
    }

    const property = await prisma.property.update({
      where: { id },
      data: parsed.data,
    });

    res.status(200).json(property);
  } catch (err) {
    console.error("❌ Failed to update property:", err);
    res.status(500).json({ error: "Failed to update property" });
  }
});

/* ==============================
   ❌ DELETE PROPERTY
================================ */
router.delete("/:id", param("id").isInt(), async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const id = parseInt(req.params.id, 10);
    await prisma.property.delete({ where: { id } });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete property:", err);
    res.status(500).json({ error: "Failed to delete property" });
  }
});

export default router;
