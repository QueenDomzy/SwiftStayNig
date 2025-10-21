// server/global.d.ts
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // optional, for attaching logged-in user
    }
  }
}
