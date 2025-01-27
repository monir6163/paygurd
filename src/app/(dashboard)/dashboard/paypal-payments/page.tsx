import BreadCrumb from "@/components/breadCrumb";
import PaypalPayment from "@/components/paypalPayment";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
const breadcrumbItems = [
  { title: "Paypal Payment", link: "/dashboard/paypal-payments" },
];

export default async function page() {
  // const user = await getCurrentUser();
  return (
    <ScrollArea className="h-full">
      <div>
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title="Add Payment Request"
            description="Create a new payment request."
          />
        </div>
        <Separator />
        <div className="max-w-2xl my-5 mx-auto shadow-md p-4 bg-slate-100 rounded-md">
          <PaypalPayment />
        </div>
      </div>
    </ScrollArea>
  );
}
