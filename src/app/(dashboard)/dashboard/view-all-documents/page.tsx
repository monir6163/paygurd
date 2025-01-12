import BreadCrumb from "@/components/breadCrumb";

// import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import ViewAllDocuments from "@/components/viewAllDocuments";
import { Separator } from "@radix-ui/react-separator";
import React from "react";
const breadcrumbItems = [
  { title: "All Documents", link: "/dashboard/view-all-documents" },
];

export default function page() {
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

        <ViewAllDocuments />
      </div>
    </ScrollArea>
  );
}
