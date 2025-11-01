import { withRoleProtection } from "@/utils/withRoleProtection";

function AdminDashboard() {
  return <div>👑 SwiftStay Admin Dashboard — Manage Hotels and Users</div>;
}

export default withRoleProtection(AdminDashboard, ["admin"]);
