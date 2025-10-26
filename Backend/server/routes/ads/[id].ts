import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  // cast to any to access ADS_STORE (shared file-scoped var above)
  // For Next.js, each module is separate; to keep example simple, re-create or
  // move store into a shared util in production.
  // For simplicity here we use a rudimentary file-scoped store: (redefine)
  // In a real app, import /lib/db to access DB.
  // For demo we respond 404 if not found.

  // NOTE: replace this waterline with DB calls.
  res.status(501).json({ error: "Replace with DB-backed implementation" });
}
