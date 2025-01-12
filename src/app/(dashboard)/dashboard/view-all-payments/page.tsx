import BreadCrumb from "@/components/breadCrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ViewAllPayments from "@/components/viewAllPayments";

import React from "react";
const breadcrumbItems = [
  { title: "All Payments", link: "/dashboard/view-all-payments" },
];

export default async function page() {
  return (
    <ScrollArea className="h-full">
      <div>
        <BreadCrumb items={breadcrumbItems} />
        {/* <div className="flex flex-col lg:flex-row gap-3 items-start justify-between">
        <Heading
          title={`All Documents`}
          description="See all documents here."
        />
      </div> */}
        <Separator className="my-1" />

        <ViewAllPayments />
      </div>
    </ScrollArea>
  );
}
