import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalPayments = await prisma.payments.count();
    const totalDocuments = await prisma.documents.count();

    const paymentStatusBreakdown =
      (await prisma.payments.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      })) || [];

    const documentStatusBreakdown =
      (await prisma.documents.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      })) || [];

    const paymentStatusData =
      paymentStatusBreakdown.map((item) => ({
        status: item.status,
        count: item._count.status,
      })) || [];

    const documentStatusData =
      documentStatusBreakdown.map((item) => ({
        status: item.status,
        count: item._count.status,
      })) || [];

    // Return response
    return NextResponse.json(
      {
        totalPayments,
        totalDocuments,
        paymentStatusData,
        documentStatusData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in Admin Analytics API:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
