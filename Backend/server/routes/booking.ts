// server/routes/booking.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

/* 🧾 Zod schema for booking creation */
const createBookingSchema = z.object({
  userId: z.number(),
  propertyId: z.number(),
  checkIn: z.string(),
  checkOut: z.string(),
});

type CreateBookingRequest = z.infer<typeof createBookingSchema>;

/* ✅ Create booking */
router.post("/", async (req: Request<{}, {}, CreateBookingRequest>, res: Response) => {
  try {
    // Validate with Zod
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { userId, propertyId, checkIn, checkOut } = parsed.data;

    // Fetch property
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return res.status(404).json({ error: "Property not found" });

    // ✅ Use existing field name from your Prisma schema
    const totalPrice = property.price; // changed from pricePerNight → price
    const commission = totalPrice * 0.08;

    // Create booking
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
    console.error("❌ Booking creation failed:", err);
    res.status(500).json({
      error: "Failed to create booking",
      details: err instanceof Error ? err.message : undefined,
    });
  }
});

/* ✅ Get all bookings */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        property: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(bookings);
  } catch (err: unknown) {
    console.error("❌ Failed to fetch bookings:", err);
    res.status(500).json({
      error: "Failed to fetch bookings",
      details: err instanceof Error ? err.message : undefined,
    });
  }
});

export default router;
