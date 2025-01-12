/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "../../../../../utils/node.mailer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.nextUrl);
    const filter = searchParams.get("filter") || "all";
    const date = searchParams.get("date");
    const whereClause: any = {};
    if (filter !== "all") {
      whereClause.status = filter;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1); // Include the entire day
      whereClause.created_at = {
        gte: startDate,
        lt: endDate,
      };
    }
    const payments = await prisma.payments.findMany({
      where: whereClause,
      include: {
        user_profiles: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    if (!payments) {
      return NextResponse.json({ error: "No payments found" }, { status: 404 });
    }

    return NextResponse.json({
      data: payments,
      message: "Payments fetched successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// payment status update with id, email and status query params in the request url send email to the user
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.nextUrl);
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const status = searchParams.get("status");
    if (!id || !email || !status) {
      return NextResponse.json(
        { error: "Please provide id, email and status" },
        { status: 400 }
      );
    }
    const payment = await prisma.payments.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    // send email to the user
    await sendMail({
      sendTo: email,
      subject: "Paygurd - Payment Status Update",
      html: `<p>
        Your payment status has been updated to ${status}
      </p>`,
    });
    return NextResponse.json({
      data: payment,
      message: "Payment status updated successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
