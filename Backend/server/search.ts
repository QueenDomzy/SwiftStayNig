// server/search.ts
import { Router, Request, Response } from "express";

const router = Router();

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  guests: number;
  amenities: string[];
  roomType: "entire_place" | "private_room" | "shared_room";
  rating?: number;
}

// ✅ Sample dataset (replace with DB query later)
const SAMPLE: Listing[] = [
  {
    id: "l1",
    title: "Cozy 1BR in Enugu",
    location: "Enugu",
    price: 25000,
    guests: 2,
    amenities: ["wifi", "ac", "kitchen"],
    roomType: "entire_place",
    rating: 4.7,
  },
  {
    id: "l2",
    title: "Studio close to market",
    location: "Enugu",
    price: 15000,
    guests: 2,
    amenities: ["wifi"],
    roomType: "private_room",
    rating: 4.3,
  },
  {
    id: "l3",
    title: "Large family home",
    location: "Abakaliki",
    price: 60000,
    guests: 6,
    amenities: ["wifi", "kitchen", "pool"],
    roomType: "entire_place",
    rating: 4.9,
  },
];

// ✅ GET /api/search
router.get("/", (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || "").toLowerCase();
    const location = String(req.query.location || "").toLowerCase();
    const priceMin = parseFloat(String(req.query.priceMin || "0")) || 0;
    const priceMax = parseFloat(String(req.query.priceMax || "0")) || 0;
    const guests = parseInt(String(req.query.guests || "0")) || 0;
    const amenities = req.query.amenities
      ? String(req.query.amenities).split(",")
      : [];
    const roomType = String(req.query.roomType || "");
    const sort = String(req.query.sort || "relevance");

    let results = SAMPLE.filter((l) => {
      if (q && !(l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q))) return false;
      if (location && l.location.toLowerCase() !== location) return false;
      if (priceMin && l.price < priceMin) return false;
      if (priceMax && priceMax > 0 && l.price > priceMax) return false;
      if (guests && l.guests < guests) return false;
      if (roomType && l.roomType !== roomType) return false;
      if (amenities.length) {
        for (const a of amenities) if (!l.amenities.includes(a)) return false;
      }
      return true;
    });

    // Sorting
    if (sort === "price_asc") results.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") results.sort((a, b) => b.price - a.price);
    if (sort === "rating") results.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    res.status(200).json({ results, count: results.length });
  } catch (err: any) {
    console.error("❌ Error processing search:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
