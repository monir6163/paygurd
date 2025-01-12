/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.nextUrl);
    const user_id = searchParams.get("user_id") as string;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Aggregate payments and documents data by user_id
    const [userPayments, userDocuments] = await Promise.all([
      prisma.payments.groupBy({
        by: ["user_id"],
        where: {
          user_id,
        },
        _count: {
          id: true,
          status: true,
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.documents.groupBy({
        by: ["user_id"],
        where: {
          user_id,
        },
        _count: {
          id: true,
          status: true,
        },
      }),
    ]);

    // If no data for the provided user_id, return an empty summary
    if (userPayments.length === 0 || userDocuments.length === 0) {
      return NextResponse.json(
        { message: "No data found for the given user" },
        { status: 404 }
      );
    }

    const userPaymentSummary =
      userPayments?.map((payment: any) => ({
        user_id: payment.user_id,
        totalPayments: payment._count.id,
        totalAmount: payment._sum.amount,
        statusBreakdown: {
          pending: payment._count.status?.["pending"] || 0,
          completed: payment._count.status?.["completed"] || 0,
          failed: payment._count.status?.["failed"] || 0,
        },
      })) || [];

    const userDocumentSummary =
      userDocuments?.map((document: any) => ({
        user_id: document.user_id,
        totalDocuments: document._count.id,
        statusBreakdown: {
          pending: document._count.status?.["pending"] || 0,
          approved: document._count.status?.["approved"] || 0,
          rejected: document._count.status?.["rejected"] || 0,
        },
      })) || [];

    // Combine both payment and document summaries by user_id
    const summary = userPaymentSummary.map((paymentSummary) => {
      const documentSummary = userDocumentSummary.find(
        (docSummary) => docSummary.user_id === paymentSummary.user_id
      );
      return {
        user_id: paymentSummary.user_id,
        totalPayments: paymentSummary.totalPayments,
        totalAmount: paymentSummary.totalAmount,
        paymentStatusBreakdown: paymentSummary.statusBreakdown,
        totalDocuments: documentSummary ? documentSummary.totalDocuments : 0,
        documentStatusBreakdown: documentSummary
          ? documentSummary.statusBreakdown
          : {},
      };
    });

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
