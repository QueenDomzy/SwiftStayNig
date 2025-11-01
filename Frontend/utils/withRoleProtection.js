import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function withRoleProtection(WrappedComponent, allowedRoles = []) {
  return function ProtectedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace("/login");
        } else if (!allowedRoles.includes(user.role?.toLowerCase())) {
          switch (user.role?.toLowerCase()) {
            case "hotel":
              router.replace("/property/dashboard");
              break;
            case "guest":
              router.replace("/guest/dashboard");
              break;
            case "admin":
              router.replace("/admin/dashboard");
              break;
            default:
              router.replace("/");
          }
        }
      }
    }, [user, loading, router]);

    if (loading || !user) return <p className="text-center mt-10">Loading...</p>;

    return <WrappedComponent {...props} />;
  };
}
