import { cn } from "@/lib/utils";

import Link from "next/link";
import { MobileSidebar } from "./mobilesidebar";
import { UserNav } from "./usernav";
import { getCurrentUser } from "@/app/actions/login";

const Header = async () => {
  const userData = await getCurrentUser();
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:flex items-center gap-2">
          <Link href={"/dashboard"} target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </Link>
          <span className="hidden lg:block ">
            {userData && userData.email?.slice(0, 5)}
          </span>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          {userData && <UserNav userData={userData} />}
        </div>
      </nav>
    </div>
  );
};

export default Header;
