/*import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function RequireRole({ roles }: { roles: string[] }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) return <Navigate to="/login" state={{ from: location }} replace />;

  const userRole = auth.user?.role ?? "user";
  if (!roles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}*/
