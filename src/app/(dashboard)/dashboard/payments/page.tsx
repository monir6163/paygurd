import { getCurrentUser } from "@/app/actions/login";
import BreadCrumb from "@/components/breadCrumb";
import { Icons } from "@/components/layout/icon";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";
import AllPayments from "@/components/allPayments";
const breadcrumbItems = [
  { title: "All Payment Request", link: "/dashboard/payments/request" },
];

export default async function page() {
  const user = await getCurrentUser();
  const user_id = user?.id as string;

  return (
    <ScrollArea className="h-full">
      <div>
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex flex-col lg:flex-row gap-3 items-start justify-between">
          <Heading
            title={`Payment Request`}
            description="See all your new payment request here."
          />
          <Button variant="outline" className="text-xs md:text-sm" asChild>
            <Link href={breadcrumbItems[0].link} className="text-sm">
              <Icons.add className="h-4 w-4" />
              Add New Payment Request
            </Link>
          </Button>
        </div>
        <Separator className="my-1" />
        {/* all payments */}
        <AllPayments user_id={user_id} />
      </div>
    </ScrollArea>
  );
}
