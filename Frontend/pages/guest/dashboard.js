import { withRoleProtection } from "@/utils/withRoleProtection";

function GuestDashboard() {
  return <div>🧳 Welcome Guest! Explore SwiftStay Nigeria.</div>;
}

export default withRoleProtection(GuestDashboard, ["guest"]);
