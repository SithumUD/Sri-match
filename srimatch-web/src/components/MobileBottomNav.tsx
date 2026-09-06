"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Users, MessageCircle, User, Crown } from "lucide-react";
import { getProfileImage } from "../utils/image.utils";

const MobileBottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    {
      label: "Discover",
      href: "/home",
      icon: Sparkles,
      isActive: pathname === "/home" || pathname === "/",
    },
    {
      label: "Connections",
      href: "/connections",
      icon: Users,
      isActive: pathname.startsWith("/connections"),
    },
    {
      label: "Messages",
      href: "/messages",
      icon: MessageCircle,
      isActive: pathname.startsWith("/messages"),
    },
    {
      label: "Profile",
      href: "/my-profile",
      icon: User,
      isActive: pathname.startsWith("/my-profile"),
      isAvatar: true,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-[#f0ddd5] bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(40,15,5,0.07)]"
      style={{ paddingBottom: "max(0.4rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center min-w-[64px] py-1 transition-all duration-200 ${
                active ? "text-[#8b4e2e]" : "text-[#9a7060] hover:text-[#6b3526]"
              }`}
            >
              {/* Active top glow indicator */}
              {active && (
                <span className="absolute -top-1.5 w-8 h-1 rounded-full bg-gradient-to-r from-[#e8c97a] to-[#c9856a]" />
              )}

              {item.isAvatar && user?.profileImage ? (
                <div className="relative mb-0.5">
                  <img
                    src={getProfileImage(user.profileImage)}
                    alt={user.firstName || "Profile"}
                    className={`h-6 w-6 rounded-full object-cover transition-all ${
                      active
                        ? "ring-2 ring-[#8b4e2e] ring-offset-1"
                        : "opacity-80"
                    }`}
                  />
                  {user.premium && (
                    <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-tr from-[#d4a017] to-[#e8c97a] text-white">
                      <Crown size={8} />
                    </span>
                  )}
                </div>
              ) : (
                <div className="relative mb-0.5">
                  <Icon
                    size={20}
                    className={`transition-transform duration-200 ${
                      active ? "scale-110 text-[#8b4e2e] stroke-[2.4]" : "stroke-[1.8]"
                    }`}
                  />
                </div>
              )}

              <span
                className={`text-[0.68rem] tracking-tight transition-colors ${
                  active ? "font-semibold text-[#8b4e2e]" : "font-normal text-[#9a7060]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
