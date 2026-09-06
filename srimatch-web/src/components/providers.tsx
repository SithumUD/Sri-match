"use client";

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster, toast } from "sonner";
import wsService from "@/services/websocket.service";
import { useRouter } from "next/navigation";

import { CallProvider } from "@/context/CallContext";
import IncomingCallModal from "@/components/chat/IncomingCallModal";
import CallModal from "@/components/chat/CallModal";

function NotificationListener() {
  const { accessToken, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const routerRef = React.useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    wsService.connect(accessToken, () => {
      wsService.subscribe("/user/queue/notifications", (notification: any) => {
        // Show in-app toast
        toast(notification.title || "New Notification", {
          description: notification.message,
          action: notification.actionUrl ? {
            label: "View",
            onClick: () => {
              if (notification.actionUrl.startsWith("http")) {
                window.open(notification.actionUrl, "_blank");
              } else {
                routerRef.current.push(notification.actionUrl);
              }
            }
          } : undefined,
        });

        // Invalidate queries so unread badge, notifications list, and connection list update immediately
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["connections"] });
      });
    });

    return () => {
      wsService.unsubscribe("/user/queue/notifications");
    };
  }, [isAuthenticated, accessToken, queryClient]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CallProvider>
          <NotificationListener />
          <IncomingCallModal />
          <CallModal />
          <Toaster position="top-center" richColors />
          {children}
        </CallProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
