// server/index.ts
import dotenv from "dotenv";
dotenv.config(); // ✅ Load env variables first

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";

// Import routes
import authRoutes from "./routes/auth";
import aiRoutes from "./routes/ai";
import propertyRoutes from "./routes/property";
import bookingRoutes from "./routes/booking";
import onboardingRoutes from "./routes/onboarding";
import paymentRoutes from "./routes/payment";
import uploadRoutes from "./routes/upload";
import userRoutes from "./routes/user";

// Import auth middleware for protected routes
import { authenticateUser } from "./middleware/auth";

const app = express();

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    origin: [
      "https://swiftstaynigeria-frontend.onrender.com", // ✅ your frontend
      "http://localhost:5173", // ✅ optional for local dev (Vite)
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // logging middleware

// --------------------
// API Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/user", authenticateUser, userRoutes);

// --------------------
// Health Check / Root
// --------------------
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 SwiftStayNig API running ✅");
});

// --------------------
// Global Error Handler
// --------------------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
