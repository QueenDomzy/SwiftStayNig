import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// ✅ GET all properties
router.get("/", async (req, res) => {
  try {
    const properties = await prisma.property.findMany();
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// ✅ GET a property by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

// ✅ CREATE a new property
router.post("/", async (req, res) => {
  try {
    const { name, location, description, price } = req.body;
    const newProperty = await prisma.property.create({
      data: { name, location, description, price: parseFloat(price) },
    });
    res.status(201).json(newProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Failed to create property" });
  }
});

// ✅ UPDATE a property
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, location, description, price } = req.body;

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { name, location, description, price: parseFloat(price) },
    });

    res.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Failed to update property" });
  }
});

// ✅ DELETE a property
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.property.delete({ where: { id } });
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Failed to delete property" });
  }
});

export default router;
