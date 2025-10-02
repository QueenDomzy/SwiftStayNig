import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// Create booking
router.post("/", async (req, res) => {
  try {
    const { userId, propertyId, checkIn, checkOut } = req.body;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return res.status(404).json({ error: "Property not found" });

    // Calculate total & commission (8%)
    const totalPrice = property.price;
    const commission = totalPrice * 0.08;

    const booking = await prisma.booking.create({
      data: {
        userId,
        propertyId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalPrice,
        commission,
      },
    });

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Get bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        property: true,
        payments: true, // ✅ FIXED (plural)
      },
    });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

export default router;
