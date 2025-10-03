import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import propertyRoutes from "./routes/property.js";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use("/api/properties", propertyRoutes);

// Health check (optional)
app.get("/", (req, res) => {
  res.json({ message: "SwiftStay Backend API is running 🚀" });
});

// Error handler (optional but useful)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
