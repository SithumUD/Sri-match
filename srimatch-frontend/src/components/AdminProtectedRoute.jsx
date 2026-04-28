import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminProtectedRoute;
