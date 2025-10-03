import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/**
 * Create a new payment
 * POST /payments
 */
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId, provider, amount, reference } = req.body;

    // ✅ Validate required fields
    if (!bookingId || !provider || !amount) {
      res.status(400).json({ error: "bookingId, provider, and amount are required" });
      return;
    }

    // ✅ Check if booking exists
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    // ✅ Create payment
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        method: provider,   // 👈 map provider → method
        amount,
        reference: reference || null,
        status: "pending",
      },
    });

    res.status(201).json(payment);
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ error: "Payment failed" });
  }
});

/**
 * Get all payments
 * GET /payments
 */
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const payments = await prisma.payment.findMany({
      include: { booking: true }, // 👈 includes booking info
    });
    res.json(payments);
  } catch (err) {
    console.error("Fetch payments error:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

export default router;
