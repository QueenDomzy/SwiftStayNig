// server/routes/ads/index.ts
import { Router, Request, Response } from "express";

const router = Router();

type Ad = {
  id: string;
  title: string;
  content: string;
  image?: string;
  active: boolean;
  createdAt: string;
};

// In-memory store (for demo purposes, replace with DB in production)
let ADS_STORE: Record<string, Ad> = {};

// Seed sample ad if empty
if (Object.keys(ADS_STORE).length === 0) {
  const id = "ad_1";
  ADS_STORE[id] = {
    id,
    title: "Launch Promo - SwiftStay",
    content: "Get 20% off your first booking.",
    image: "",
    active: true,
    createdAt: new Date().toISOString(),
  };
}

/* ----------------------------
   GET /api/ads → List ads
----------------------------- */
router.get("/", (req: Request, res: Response) => {
  try {
    const activeQuery = req.query.active === "true";
    const ads = Object.values(ADS_STORE).filter((a) =>
      req.query.active ? a.active === activeQuery : true
    );
    res.status(200).json({ ads });
  } catch (err: any) {
    console.error("❌ Failed to fetch ads:", err);
    res.status(500).json({ error: "Failed to fetch ads" });
  }
});

/* ----------------------------
   POST /api/ads → Create ad
----------------------------- */
router.post("/", (req: Request, res: Response) => {
  try {
    const { title, content, image, active } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "title & content required" });
    }

    const id = `ad_${Date.now()}`;
    const ad: Ad = {
      id,
      title,
      content,
      image: image || "",
      active: !!active,
      createdAt: new Date().toISOString(),
    };

    ADS_STORE[id] = ad;
    res.status(201).json({ ad });
  } catch (err: any) {
    console.error("❌ Failed to create ad:", err);
    res.status(500).json({ error: "Failed to create ad" });
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
