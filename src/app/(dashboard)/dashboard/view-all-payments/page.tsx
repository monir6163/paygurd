import BreadCrumb from "@/components/breadCrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ViewAllPayments from "@/components/viewAllPayments";
import axios from "axios";

import React from "react";
const breadcrumbItems = [
  { title: "All Payments", link: "/dashboard/view-all-payments" },
];

async function getSummary() {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics/summery`
    );
    console.log(data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log(error.response.data.error);
    } else {
      console.log(error);
    }
  }
}

export default async function page() {
  const analytics = await getSummary();
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

        <ViewAllPayments analytics={analytics} />
      </div>
    </ScrollArea>
  );
}
