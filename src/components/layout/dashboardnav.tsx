/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./icon";

export function DashboardNav({ items, setOpen, user }: any) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  // Filter items based on user role
  const filteredItems = items.filter(
    (item: { role?: string }) =>
      !item.role || item.role === user?.user_metadata?.user_role
  );

  return (
    <nav className="grid items-start gap-2">
      {filteredItems.map(
        (
          item: {
            icon?: keyof typeof Icons;
            href?: string;
            disabled?: boolean;
            title?: string;
          },
          index: number
        ) => {
          const Icon = Icons[item.icon ?? "arrowRight"];
          return (
            item.href && (
              <Link
                key={index}
                href={item.disabled ? "/" : item.href}
                onClick={() => {
                  if (setOpen) setOpen(false);
                }}
              >
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </span>
              </Link>
            )
          );
        }
      )}
    </nav>
  );
}
