import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// Record a payment
router.post("/", async (req, res) => {
  try {
    const { bookingId, provider, amount, reference } = req.body;

    const payment = await prisma.payment.create({
  data: {
    bookingId,
    method: provider,  // 👈 map provider → method
    amount,
    reference,
    status: "pending",
  },
});

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: "Payment failed" });
  }
});

// Get all payments
router.get("/", async (req, res) => {
  const payments = await prisma.payment.findMany({ include: { booking: true } });
  res.json(payments);
});

export default router;
