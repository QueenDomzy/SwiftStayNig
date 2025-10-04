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

// 🟢 Enable CORS
app.use(cors({
  origin: '*', // You can later restrict this to your frontend URL
}));

// 🟢 Parse JSON request bodies
app.use(bodyParser.json());

// 🟢 Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

// 🟢 Health check route
app.get('/', (req, res) => {
  res.json({ message: 'SwiftStay Backend running ✅' });
});

// 🟢 JWT Middleware
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

// 🟢 Firebase Auth Middleware
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

// 🟢 Properties Routes
app.get('/properties', async (req, res) => {
  try {
    const properties = await prisma.property.findMany();
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/properties/:id', async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// 🟢 Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 SwiftStay Backend running on port ${PORT}`));
