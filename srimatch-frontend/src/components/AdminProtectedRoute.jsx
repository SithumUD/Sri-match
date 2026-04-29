import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

const AdminProtectedRoute = ({ children }) => {
  const { user, adminUser, isAuthenticated, isAdminAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  const currentUser = adminUser || user;
  const isActuallyAdmin = isAdminAuthenticated || (isAuthenticated && (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"));

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isActuallyAdmin) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminProtectedRoute;
