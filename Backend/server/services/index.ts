import type { NextApiRequest, NextApiResponse } from "next";

type Service = {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  images?: string[];
  location: string;
  amenities: string[];
  createdAt: string;
};

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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const list = Object.values(SERVICES);
    return res.status(200).json({ services: list });
  }

  if (req.method === "POST") {
    const { title, description, pricePerNight, location, amenities } = req.body;
    if (!title || !pricePerNight) return res.status(400).json({ error: "title and pricePerNight required" });
    const id = `s_${Date.now()}`;
    const service = {
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
    return res.status(201).json({ service });
  }

  res.setHeader("Allow", "GET,POST");
  res.status(405).end("Method Not Allowed");
}
