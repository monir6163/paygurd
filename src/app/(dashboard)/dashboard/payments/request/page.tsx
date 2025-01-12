import { getCurrentUser } from "@/app/actions/login";
import BreadCrumb from "@/components/breadCrumb";
import NewRequest from "@/components/newRequest";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
const breadcrumbItems = [{ title: "Add Task", link: "/dashboard/addtask" }];

const page = async () => {
  const user = await getCurrentUser();
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
          <NewRequest user={user} />
        </div>
      </div>
    </ScrollArea>
  );
};

export default page;
