"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Layout>
        {children}
      </Layout>
    </ProtectedRoute>
  );
}
