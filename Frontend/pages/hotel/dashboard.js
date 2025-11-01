import { withRoleProtection } from "@/utils/withRoleProtection";

function HotelDashboard() {
  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;
  return (
    <div>
      <h2>🏨 Hotel Dashboard</h2>
      <p>Welcome, {email}</p>
      <p>Your Hotel QR Code</p>
      <img src={`/api/hotel/qr/${email}`} alt="Hotel QR" />
      <p>Scan to onboard your property or share with guests.</p>
    </div>
  );
}

export default withRoleProtection(HotelDashboard, ["hotel", "admin"]);
