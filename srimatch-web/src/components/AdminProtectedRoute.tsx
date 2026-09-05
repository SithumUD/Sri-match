"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, adminUser, isAuthenticated, isAdminAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();

  const currentUser = adminUser || user;
  const isActuallyAdmin = isAdminAuthenticated || (isAuthenticated && (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"));

  useEffect(() => {
    if (!isAuthLoading) {
      if (!currentUser) {
        router.replace("/admin/login");
      } else if (!isActuallyAdmin) {
        router.replace("/");
      }
    }
  }, [currentUser, isActuallyAdmin, isAuthLoading, router]);

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  if (!currentUser || !isActuallyAdmin) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
