/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAccessToken } from "@/lib/getAccessToken";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `${process.env.PAYPAL_SANDBOX_URL}/v2/invoicing/invoices?page=1&page_size=20&total_required=false`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      status: 200,
      invoices: response.data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error in GET:", error.response?.data || error.message);
      return NextResponse.json(
        {
          status: 500,
          message: error.response?.data?.message || "Failed to fetch invoices",
        },
        { status: 500 }
      );
    } else {
      console.error("Error in GET:", error);
      return NextResponse.json(
        { status: 500, message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
