"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAuthLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isProfileComplete = user?.profileCompleted === true || user?.hasProfile === true || !!user?.userId;
  const isProfileCreationPage = pathname === "/profile-creation";
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        router.replace("/");
      } else if (!isAdmin && !isProfileComplete && !isProfileCreationPage) {
        router.replace("/profile-creation");
      }
    }
  }, [isAuthenticated, isAuthLoading, isProfileComplete, isProfileCreationPage, isAdmin, router]);

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  if (!isAdmin && !isProfileComplete && !isProfileCreationPage) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
