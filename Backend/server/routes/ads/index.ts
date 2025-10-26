import type { NextApiRequest, NextApiResponse } from "next";

type Ad = {
  id: string;
  title: string;
  content: string;
  image?: string;
  active: boolean;
  createdAt: string;
};

let ADS_STORE: Record<string, Ad> = {};
// seed sample
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // optional ?active=true filter
    const active = req.query.active === "true";
    const ads = Object.values(ADS_STORE).filter((a) => (req.query.active ? a.active === active : true));
    return res.status(200).json({ ads });
  }

  if (req.method === "POST") {
    const { title, content, image, active } = req.body;
    if (!title || !content) return res.status(400).json({ error: "title & content required" });
    const id = `ad_${Date.now()}`;
    const ad: Ad = { id, title, content, image: image || "", active: !!active, createdAt: new Date().toISOString() };
    ADS_STORE[id] = ad;
    return res.status(201).json({ ad });
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
