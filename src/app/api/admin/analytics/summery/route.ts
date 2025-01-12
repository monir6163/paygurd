import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [totalPayments, paymentStatusBreakdown] = await Promise.all([
      prisma.payments.count(),

      // Group payments by status
      prisma.payments.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      }),
    ]);

    // Format the status-based breakdowns
    const statusData =
      paymentStatusBreakdown?.map((item) => ({
        status: item.status,
        count: item._count.status,
      })) || [];

    return NextResponse.json(
      {
        totalPayments,
        statusData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data." },
      { status: 500 }
    );
  }
}
