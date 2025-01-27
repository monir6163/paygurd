/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./icon";

export function DashboardNav({ user }: any) {
  const path = usePathname();

  return (
    <nav className="grid items-start gap-2">
      <Link href="/dashboard">
        <div
          className={cn(
            "flex items-center px-3 py-2 rounded-md",
            path === "/dashboard" && "bg-gray-100 text-gray-900"
          )}
        >
          <Icons.dashboard className="w-6 h-6 mr-2" />
          Dashboard
        </div>
      </Link>
      {user?.user_metadata?.user_role === "user" && (
        <>
          <Link href="/dashboard/payments">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-md",
                path === "/dashboard/payments" && "bg-gray-100 text-gray-900"
              )}
            >
              <Icons.payment className="w-6 h-6 mr-2" />
              Payments
            </div>
          </Link>
          <Link href="/dashboard/documents">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-md",
                path === "/dashboard/documents" && "bg-gray-100 text-gray-900"
              )}
            >
              <Icons.page className="w-6 h-6 mr-2" />
              Documents
            </div>
          </Link>
          <Link href="/dashboard/paypal-payments">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-md",
                path === "/dashboard/documents" && "bg-gray-100 text-gray-900"
              )}
            >
              <Icons.payment className="w-6 h-6 mr-2" />
              Paypal Payments
            </div>
          </Link>
        </>
      )}
      {user?.user_metadata?.user_role === "admin" && (
        <>
          <Link href="/dashboard/view-all-payments">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-md",
                path === "/dashboard/view-all-payments" &&
                  "bg-gray-100 text-gray-900"
              )}
            >
              <Icons.payment className="w-6 h-6 mr-2" />
              View All Payments
            </div>
          </Link>
          <Link href="/dashboard/view-all-documents">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-md",
                path === "/dashboard/view-all-documents" &&
                  "bg-gray-100 text-gray-900"
              )}
            >
              <Icons.page className="w-6 h-6 mr-2" />
              View All Documents
            </div>
          </Link>
        </>
      )}
    </nav>
  );
}
