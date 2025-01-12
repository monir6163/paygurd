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

    const userPayments = await prisma.payments.findMany({
      where: { user_id },
      select: {
        status: true,
        amount: true,
      },
    });

    const userDocuments = await prisma.documents.findMany({
      where: { user_id },
      select: {
        status: true,
      },
    });

    if (userPayments.length === 0 && userDocuments.length === 0) {
      return NextResponse.json(
        { message: "No data found for the given user" },
        { status: 404 }
      );
    }

    const paymentStatusBreakdown = userPayments.reduce(
      (acc: Record<string, number>, payment) => {
        acc[payment.status] = (acc[payment.status] || 0) + 1;
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 }
    );
    const totalPayments = userPayments.length;
    const totalAmount = userPayments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    const documentStatusBreakdown = userDocuments.reduce(
      (acc: Record<string, number>, document) => {
        acc[document.status] = (acc[document.status] || 0) + 1;
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 }
    );

    const summary = {
      user_id,
      totalPayments,
      totalAmount,
      paymentStatusBreakdown,
      totalDocuments: userDocuments.length,
      documentStatusBreakdown,
    };

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
