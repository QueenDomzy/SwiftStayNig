# 🏨 SwiftStay Backend

SwiftStay Backend is the API service for **SwiftStay Nigeria**, a hotel reservation and property booking platform.  
It provides authentication, property listings, bookings, and payments, all powered by **Node.js, Express, Prisma, and PostgreSQL**.

---

## 🚀 Tech Stack
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Render / Railway / Vercel](https://render.com/) (for deployment)

---

## 📦 Installation & Setup

Clone the repo:
```bash
git clone https://github.com/your-username/swiftstay-backend.git
cd swiftstay-backend



▶️ Running the Server

Development:

npm run dev

Build:

npm run build

Production:

npm start


---

🌐 API Documentation

🔑 Auth Routes (/auth)

POST /auth/register → Register a new user

POST /auth/login → Login with email & password



---

🏠 Property Routes (/properties)

POST /properties → Create a property

GET /properties → Get all properties

GET /properties/:id → Get property by ID



---

📅 Booking Routes (/bookings)

POST /bookings → Create a booking

GET /bookings → Get all bookings (with user & property info)



---

💳 Payment Routes (/payments)

POST /payments → Create a payment for a booking

GET /payments → Get all payments


