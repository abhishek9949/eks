"use client";

import { Tabs, Tab, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabRoutes = [
  { label: "My Profile", href: "/personal-info" },
  { label: "Notifications", href: "/personal-info/notifications" },
];

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div>
      <Tabs value={pathname} sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3 }}>
        {tabRoutes.map((tab) => (
          <Tab
            key={tab.href}
            label={tab.label}
            component={Link}
            href={tab.href}
            value={tab.href}
          />
        ))}
      </Tabs>
      <Box>{children}</Box>
    </div>
  );
}
