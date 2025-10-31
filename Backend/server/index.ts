// server/index.ts

import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// 🧩 Import routes
import loginRoutes from "./routes/auth/login";
import signupRoutes from "./routes/auth/signup";
import aiRoutes from "./routes/ai";
import propertyRoutes from "./routes/property";
import bookingRoutes from "./routes/booking";
import onboardingRoutes from "./routes/onboarding";
import paymentRoutes from "./routes/payment";
import uploadRoutes from "./routes/upload";
import userRoutes from "./routes/user";

// 🧩 Import auth middleware
import { authenticateUser } from "./middleware/auth";

dotenv.config();

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // logging middleware

// --------------------
// API ROUTES
// --------------------

// ✅ Auth (split by concern)
app.use("/api/auth", loginRoutes);
app.use("/api/auth", signupRoutes);

// ✅ AI
app.use("/api/ai", aiRoutes);

// ✅ Properties
app.use("/api/properties", propertyRoutes);

// ✅ Bookings
app.use("/api/bookings", bookingRoutes);

// ✅ Onboarding
app.use("/api/onboarding", onboardingRoutes);

// ✅ Payments
app.use("/api/payments", paymentRoutes);

// ✅ Uploads
app.use("/api/upload", uploadRoutes);

// ✅ User profile (protected)
app.use("/api/user", authenticateUser, userRoutes);

// --------------------
// HEALTH CHECK / ROOT
// --------------------
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 SwiftStayNig API running ✅");
});

// --------------------
// GLOBAL ERROR HANDLER
// --------------------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
