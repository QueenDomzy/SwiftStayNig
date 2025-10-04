import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/**
 * 🏠 Add a property
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, location, price, description, images, ownerId } = req.body;

    const property = await prisma.property.create({
      data: { name, location, price, description, images, ownerId },
    });

    res.json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Failed to create property" });
  }
});

/**
 * 📋 Get all properties
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      include: { owner: true }, // optional: show owner details
    });
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

/**
 * 🔍 Get one property by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { owner: true }, // optional
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

export default router;
