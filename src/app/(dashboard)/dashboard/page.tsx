import AdminAnalyticsChart from "@/components/adminAnalyticsChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

async function getAnalytics() {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`
    );
    return data || {};
  } catch (error) {
    console.log(error);
  }
}

export default async function page() {
  const analytics = await getAnalytics();
  return (
    <ScrollArea className="h-full">
      <div>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <div className="mt-8 w-11/12 p-0 bg-white rounded-lg shadow-md">
          {analytics && <AdminAnalyticsChart analytics={analytics} />}
        </div>
      </div>
    </ScrollArea>
  );
}
