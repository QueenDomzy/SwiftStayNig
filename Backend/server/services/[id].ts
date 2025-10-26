import type { NextApiRequest, NextApiResponse } from "next";

let SERVICES_REF = {} as Record<string, any>;
// In production: import { findService, updateService, deleteService } from '../../lib/services';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // This is a placeholder. Replace with DB calls.
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Service id required" });

  // sample response
  if (req.method === "GET") {
    return res.status(501).json({ error: "Implement DB-backed GET" });
  }

  if (req.method === "PUT") {
    return res.status(501).json({ error: "Implement DB-backed UPDATE" });
  }

  if (req.method === "DELETE") {
    return res.status(501).json({ error: "Implement DB-backed DELETE" });
  }

  res.setHeader("Allow", "GET,PUT,DELETE");
  res.status(405).end("Method Not Allowed");
}
