import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function withRoleProtection(Component, allowedRoles) {
  return function ProtectedPage(props) {
    const router = useRouter();
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    useEffect(() => {
      if (!role || !allowedRoles.includes(role)) {
        router.push("/unauthorized");
      }
    }, [role, router]);

    return <Component {...props} />;
  };
}
