/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  try {
    const accessToken = await getAccessToken(); // Get the access token

    const invoiceData = {
      merchant_info: {
        email: "contact@adaptifyloop.com",
        first_name: "adaptifyloop",
        last_name: ".com",
        business_name: "adaptifyloop",
        phone: {
          country_code: "001",
          national_number: "4085551234",
        },
        address: {
          line1: "1234 First Street",
          city: "Germany",
          state: "CA",
          postal_code: "98765",
          country_code: "US",
        },
      },
      billing_info: [
        {
          email: "monirhossain6163@gmail.com",
          first_name: "Monir",
          last_name: "Hossain",
        },
      ],
      shipping_info: {
        first_name: "Monir",
        last_name: "Hossain",
        address: {
          line1: "Mirpur 02",
          city: "Dhaka",
          state: "Dhaka",
          postal_code: "1216",
          country_code: "BD",
        },
      },
      items: [
        {
          name: "Zoom System wireless headphones",
          quantity: 2,
          unit_price: {
            currency: "USD",
            value: Math.floor(Math.random() * 100).toString(),
          },
          tax: {
            name: "Tax",
            percent: Math.floor(Math.random() * 10),
          },
        },
        {
          name: "Bluetooth speaker",
          quantity: 1,
          unit_price: {
            currency: "USD",
            value: Math.floor(Math.random() * 100).toString(),
          },
          tax: {
            name: "Tax",
            percent: Math.floor(Math.random() * 10),
          },
        },
      ],
      discount: {
        percent: Math.floor(Math.random() * 10),
      },
      shipping_cost: {
        amount: {
          currency: "USD",
          value: Math.floor(Math.random() * 100).toString(),
        },
      },
      note: "Thank you for your business.",
      terms: "No refunds after 30 days.",
    };

    const InvoiceRes = await axios.post(
      `${process.env.PAYPAL_SANDBOX_URL}/v1/invoicing/invoices`,
      invoiceData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Include the OAuth token here
        },
      }
    );

    // store the invoice id in the database
    return NextResponse.json({
      message: "Invoice created successfully",
      data: InvoiceRes.data,
      status: 200,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Log the response body to get the full error message
      console.error(
        "Error creating invoice:",
        (error as any).response?.data || (error as Error).message
      );
    } else {
      console.error("Error creating invoice:", error);
    }
    return NextResponse.json({
      message: "Failed to create invoice",
      status: 500,
    });
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
