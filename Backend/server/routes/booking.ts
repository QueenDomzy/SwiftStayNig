// server/routes/booking.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

// Zod schema for booking creation
const createBookingSchema = z.object({
  userId: z.number(),
  propertyId: z.number(),
  checkIn: z.string(),
  checkOut: z.string(),
});

// Type for request body
type CreateBookingRequest = z.infer<typeof createBookingSchema>;

// Create booking
router.post("/", async (req: Request<{}, {}, CreateBookingRequest>, res: Response) => {
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
      include: {
        user: true,
        property: true,
        payments: true,
      },
    });

    res.status(201).json(booking);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: "Failed to create booking", details: err instanceof Error ? err.message : undefined });
  }
});

// Get bookings
router.get("/", async (_req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        property: true,
        payments: true,
      },
    });
    res.status(200).json(bookings);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings", details: err instanceof Error ? err.message : undefined });
  }
});

export default router;
