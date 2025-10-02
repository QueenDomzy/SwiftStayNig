import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/property";
import bookingRoutes from "./routes/booking";
import paymentRoutes from "./routes/payment";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ message: "SwiftStay Backend running ✅" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/properties", propertyRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SwiftStay Backend running on port ${PORT}`);
});
