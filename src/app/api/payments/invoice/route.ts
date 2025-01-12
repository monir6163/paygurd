import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.nextUrl);
    const user_id = searchParams.get("user_id") as string;
    const pay_id = searchParams.get("pay_id") as string;

    if (!user_id || !pay_id) {
      return NextResponse.json({
        status: 400,
        message: "User ID and Payment ID are required",
      });
    }
    const paymentInvoice = await prisma.payments.findUnique({
      where: {
        id: pay_id,
        user_id: user_id,
      },
      include: {
        user_profiles: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json({ status: 200, data: paymentInvoice });
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
