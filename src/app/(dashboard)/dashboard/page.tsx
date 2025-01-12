/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from "@/app/actions/login";
import AdminAnalyticsChart from "@/components/adminAnalyticsChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserSummary from "@/components/userSummaryCard";
import axios from "axios";

async function getAnalytics(user: any) {
  try {
    let userSummary;
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`
    );

    if (user?.user_metadata?.user_role === "user") {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics/summery/user?user_id=${user?.id}`
      );
      userSummary = data || {};
    }

    return { ...data, userSummary };
  } catch (error) {
    console.log(error);
  }
}

export default async function page() {
  const user = await getCurrentUser();
  const analytics = await getAnalytics(user || "");
  return (
    <ScrollArea className="h-full">
      <div>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <div className="mt-8 w-full lg:w-11/12 p-0 bg-white rounded-lg shadow-md">
          {user?.user_metadata?.user_role === "admin" && (
            <AdminAnalyticsChart analytics={analytics} />
          )}
          {user?.user_metadata?.user_role === "user" && (
            <UserSummary analytics={analytics?.userSummary} />
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
