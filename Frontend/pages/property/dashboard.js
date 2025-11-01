import { withRoleProtection } from "@/utils/withRoleProtection";

function PropertyDashboard() {
  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;
  return (
    <div>
      <h2>🏨 Property Dashboard</h2>
      <p>Welcome, {email}</p>
      <p>Your Property QR Code</p>
      <img src={`/api/property/qr/${email}`} alt="Property QR" />
      <p>Scan to onboard your property or share with guests.</p>
    </div>
  );
}

export default withRoleProtection(PropertyDashboard, ["property", "admin"]);
