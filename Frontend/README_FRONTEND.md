# SwiftStay Frontend — ABnB support

## Setup
1. Add `.env.local`:
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
2. `npm install`
3. `npm run dev`

## Pages/components added
- components/SearchFilters.jsx
- components/PropertyCard.jsx
- components/PaymentSelector.jsx
- lib/api.js
- pages/booking/[id].jsx

## Notes
- Replace `userId` and email placeholders with real authenticated user data.
- Ensure NEXT_PUBLIC_API_BASE_URL points to your backend.
