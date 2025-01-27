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
      endDate.setDate(endDate.getDate() + 1);
      whereClause.uploaded_at = {
        gte: startDate,
        lt: endDate,
      };
    }
    const documents = await prisma.documents.findMany({
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
        uploaded_at: "desc",
      },
    });
    if (!documents) {
      return NextResponse.json(
        { error: "No documents found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      data: documents,
      message: "documents fetched successfully",
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
    const document = await prisma.documents.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    if (!document) {
      return NextResponse.json(
        { error: "document not found" },
        { status: 404 }
      );
    }
    // send email to the user
    await sendMail({
      sendTo: email,
      subject: "Paygurd - Document Status Update",
      html: `<p>Your document status has been updated to ${status}</p>`,
    });
    return NextResponse.json({
      data: document,
      message: "Document status updated successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
