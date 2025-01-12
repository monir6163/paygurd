/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from "@/app/actions/login";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: any) => {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/");
  }

  return (
    <>
      <Header />
      <div className="flex h-screen">
        <Sidebar />
        <main className="w-full pt-16 overflow-y-auto">
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">{children}</div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
