/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const bodyData = await request.json();

    if (!bodyData.user_id) {
      return NextResponse.json({
        status: 400,
        message: "User ID is required",
      });
    }

    const payment = await prisma.payments.create({
      data: {
        title: bodyData.title,
        amount: bodyData.amount,
        status: bodyData.status,
        user_id: bodyData.user_id,
      },
    });

    return NextResponse.json({
      message: "Payment request created",
      status: 201,
      data: payment,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 500, message: error.message });
    } else {
      return NextResponse.json({
        status: 500,
        message: "An unexpected error occurred",
      });
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // logged in user wise get all payments request
    const { searchParams } = new URL(request.nextUrl);
    const user_id = searchParams.get("user_id") as string;
    const filter = searchParams.get("filter") || "all";
    const date = searchParams.get("date");
    const whereClause: any = {
      user_id,
    };

    // Apply status filter if it's not "all"
    if (filter !== "all") {
      whereClause.status = filter;
    }

    // Apply date filter if a date is provided
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
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ status: 200, data: payments });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 500, message: error.message });
    } else {
      return NextResponse.json({
        status: 500,
        message: "An unexpected error occurred",
      });
    }
  }
}
