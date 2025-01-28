import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    const { searchParams } = new URL(request.nextUrl);
    const invoice_id = searchParams.get("invoice_id") as string;

    console.log("🔍 Searching for invoice ID:", invoice_id);

    if (!invoice_id) {
      return NextResponse.json(
        { status: 400, message: "Missing invoice ID" },
        { status: 400 }
      );
    }

    const response = await axios.delete(
      `${process.env.PAYPAL_SANDBOX_URL}/v2/invoicing/invoices/${invoice_id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      status: 200,
      invoices: response.data, // List of invoices
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Error in GET:", error.response?.data || error.message);
      return NextResponse.json(
        {
          status: 500,
          message: error.response?.data?.message || "Failed to fetch invoices",
        },
        { status: 500 }
      );
    } else {
      console.error("❌ Error in GET:", error);
      return NextResponse.json(
        { status: 500, message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

// ✅ Get PayPal Access Token
const getAccessToken = async () => {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("❌ Missing PayPal credentials");
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const res = await axios.post(
      `${process.env.PAYPAL_SANDBOX_URL}/v1/oauth2/token`,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return res.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "❌ Failed to get access token:",
        error.response?.data || error
      );
    } else {
      console.error("❌ Failed to get access token:", error);
    }
    throw new Error("❌ Failed to get access token");
  }
};
