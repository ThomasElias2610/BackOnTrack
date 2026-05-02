"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Brain, Star } from "lucide-react";

const tabs = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Check-in", href: "/checkin", icon: Heart },
  { label: "Exercises", href: "/exercises", icon: Brain },
  { label: "Milestones", href: "/milestones", icon: Star },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "var(--nav-bg)",
        borderTop: "1px solid var(--nav-border)",
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-around",
          padding: "8px 0",
        }}
      >
        {tabs.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "6px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                color: active ? "var(--green-primary)" : "var(--gray-mid)",
                transition: "color 0.15s ease",
              }}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: active ? 600 : 400,
                  letterSpacing: "0.01em",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
