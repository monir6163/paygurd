import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { DashboardNav } from "./dashboardnav";
import { getCurrentUser } from "@/app/actions/login";

export default async function Sidebar() {
  const user = await getCurrentUser();
  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-16 lg:block w-72`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {/* <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
              Overview
            </h2> */}
            <DashboardNav items={navItems} user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
