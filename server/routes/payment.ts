// server/routes/payment.ts
import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient, BookingStatus } from "@prisma/client";

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
router.post(
  "/",
  async (req: Request<{}, {}, PaymentRequestBody>, res: Response, next: NextFunction) => {
    try {
      const { bookingId, provider, amount, reference } = req.body;

      const parsedBookingId = Number(bookingId);
      if (isNaN(parsedBookingId)) {
        return res.status(400).json({ error: "Invalid bookingId" });
      }

      const booking = await prisma.booking.findUnique({
        where: { id: parsedBookingId },
      });

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      const payment = await prisma.payment.create({
        data: {
          bookingId: parsedBookingId,
          method: provider,
          amount: Number(amount),
          reference,
          status: "completed",
        },
      });

      // Update booking status
      await prisma.booking.update({
  where: { id: parsedBookingId },
  data: {
    status: "CONFIRMED", // if `status` is String
    // OR
    // status: BookingStatus.CONFIRMED, // if status is enum
  },
});

      res.status(201).json({
        message: "Payment recorded and booking confirmed",
        payment,
      });
    } catch (err: unknown) {
      console.error("Payment error:", err);
      res.status(500).json({
        error: "Payment failed",
        details: err instanceof Error ? err.message : undefined,
      });
    }
  }
);

// Get all payments
router.get("/", async (_req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { booking: true },
    });
    res.status(200).json(payments);
  } catch (err: unknown) {
    console.error("Fetch Payment error:", err);
    res.status(500).json({
      error: "Could not fetch Payment",
      details: err instanceof Error ? err.message : undefined,
    });
  }
});

export default router;
