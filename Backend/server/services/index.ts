// server/services/index.ts
import { Router, Request, Response } from "express";

const router = Router();

// In-memory store (replace with DB in production)
interface Service {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  images?: string[];
  location: string;
  amenities: string[];
  createdAt: string;
}

let SERVICES: Record<string, Service> = {
  s1: {
    id: "s1",
    title: "Cozy Enugu Suite",
    description: "1BR near city center, fast wifi, self check-in",
    pricePerNight: 25000,
    images: [],
    location: "Enugu",
    amenities: ["wifi", "kitchen"],
    createdAt: new Date().toISOString(),
  },
};

/* ----------------------------
   GET /api/services → List all services
----------------------------- */
router.get("/", (req: Request, res: Response) => {
  try {
    const list = Object.values(SERVICES);
    res.status(200).json({ services: list });
  } catch (err: any) {
    console.error("❌ Failed to fetch services:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ----------------------------
   POST /api/services → Create a new service
----------------------------- */
router.post("/", (req: Request, res: Response) => {
  try {
    const { title, description, pricePerNight, location, amenities } = req.body;
    if (!title || !pricePerNight) {
      return res.status(400).json({ error: "title and pricePerNight required" });
    }

    const id = `s_${Date.now()}`;
    const service: Service = {
      id,
      title,
      description: description || "",
      pricePerNight: Number(pricePerNight),
      images: [],
      location: location || "Unknown",
      amenities: amenities || [],
      createdAt: new Date().toISOString(),
    };

    SERVICES[id] = service;
    res.status(201).json({ service });
  } catch (err: any) {
    console.error("❌ Failed to create service:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ----------------------------
   Handle unsupported methods
----------------------------- */
router.all("/", (_req: Request, res: Response) => {
  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
});

export default router;
