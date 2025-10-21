import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// Define request body type
interface PaymentRequestBody {
  bookingId: number | string;
  provider: string;
  amount: number | string;
  reference: string;
}

// Record a payment
router.post("/", async (req: Request<{}, {}, PaymentRequestBody>, res: Response) => {
  try {
    const { bookingId, provider, amount, reference } = req.body;

    // Ensure bookingId is a number
    const parsedBookingId = Number(bookingId);
    if (isNaN(parsedBookingId)) {
      return res.status(400).json({ error: "Invalid bookingId" });
    }

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: parsedBookingId },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        bookingId: parsedBookingId,
        method: provider,
        amount: Number(amount),
        reference,
        status: "completed",
      },
    });

    // Update booking status after payment
    await prisma.booking.update({
      where: { id: parsedBookingId },
      data: { status: "confirmed" },
    });

    res.status(201).json({
      message: "Payment recorded and booking confirmed",
      payment,
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ error: "Payment failed" });
  }
});

// Get all payments
router.get("/", async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { booking: true },
    });
    res.json(payments);
  } catch (err) {
    console.error("Fetch payments error:", err);
    res.status(500).json({ error: "Could not fetch payments" });
  }
});

export default router;
