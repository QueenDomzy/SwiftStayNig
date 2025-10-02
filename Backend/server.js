import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// Firebase Admin init
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SwiftStay Backend running ✅' });
});

// JWT Middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// Firebase Auth Middleware
async function authenticateFirebase(req, res, next) {
  const idToken = req.headers.authorization?.split(' ')[1];
  if (!idToken) return res.sendStatus(401);
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid Firebase token' });
  }
}

// Example Properties route
app.get('/properties', async (req, res) => {
  const props = await prisma.property.findMany();
  res.json(props);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SwiftStay Backend running on port ${PORT}`));
