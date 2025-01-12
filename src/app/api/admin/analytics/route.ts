import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      totalPayments,
      totalDocuments,
      paymentStatusBreakdown,
      documentStatusBreakdown,
    ] = await Promise.all([
      prisma.payments.count(),
      prisma.documents.count(),
      prisma.payments.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      }),
      prisma.documents.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      }),
    ]);

    const paymentStatusData = paymentStatusBreakdown.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));

    const documentStatusData = documentStatusBreakdown.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));

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
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
