import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { DashboardNav } from "./dashboardnav";
import { getCurrentUser } from "@/app/actions/login";

export async function MobileSidebar() {
  // const [open, setOpen] = useState(false);
  const user = await getCurrentUser();

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetTitle></SheetTitle>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Overview
              </h2>
              <div className="space-y-1">
                <DashboardNav user={user} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
