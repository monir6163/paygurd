/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    const bodyData = await request.json();
    if (!bodyData.amount) {
      return NextResponse.json({
        status: 400,
        message: "Amount is required",
      });
    }

    // can not allow negative amount or zero amount
    if (bodyData.amount <= 0 || isNaN(bodyData.amount)) {
      return NextResponse.json({
        status: 400,
        message: "Amount should be greater than zero and should be a number",
      });
    }
    if (!accessToken) {
      return NextResponse.json({
        status: 400,
        message: "Access token is required",
      });
    }

    const res = await axios.post(
      `${process.env.PAYPAL_SANDBOX_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            items: [
              {
                name: "T-shirt",
                description: "Green XL",
                quantity: "1",
                unit_amount: {
                  currency_code: "USD",
                  value: bodyData.amount.toString(),
                },
              },
            ],
            amount: {
              currency_code: "USD",
              value: bodyData.amount.toString(),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: bodyData.amount.toString(),
                },
              },
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              payment_method_selected: "PAYPAL",
              brand_name: "Monir Dev",
              shipping_preference: "NO_SHIPPING",
              locale: "en-US",
              user_action: "PAY_NOW",
              return_url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/complete-payment`,
              cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/cancel-payment`,
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const orderId = res.data.id;
    return NextResponse.json({
      message: "Payment request created",
      status: 201,
      orderId,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error in POST:", error.response?.data || error.message);
    } else {
      console.error("Error in POST:", error);
    }
    return NextResponse.json({
      status: 500,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}

// get paymentId from the query string
export async function GET(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    const { searchParams } = new URL(request.nextUrl);
    const paymentId = searchParams.get("paymentId") as string;
    const userId = searchParams.get("userId") as string;
    if (!paymentId) {
      return NextResponse.json({
        status: 400,
        message: "Payment ID is required",
      });
    }
    const res = await axios.post(
      `${process.env.PAYPAL_SANDBOX_URL}/v2/checkout/orders/${paymentId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.status !== "COMPLETED") {
      return NextResponse.json({
        message: "Payment not completed",
        status: 400,
        data: res.data,
      });
    }

    const invoiceData = await createInvoice(res);

    // store the payment details in the database

    // console.log("Payment captured:", res.data);
    const payload = {
      title: "T-shirt",
      amount:
        res?.data?.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      status: res?.data?.status === "COMPLETED" ? "COMPLETED" : "PENDING",
      user_id: userId,
    };
    // console.log("payload", payload);
    await prisma.payments.create({ data: payload });

    return NextResponse.json({
      message: "Payment captured",
      status: 200,
      data: res.data,
      invoiceData,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error in GET:", error.response?.data || error.message);
    } else {
      console.error("Error in GET:", error);
    }
    return NextResponse.json({
      status: 500,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}

// Get access token from PayPal
const getAccessToken = async () => {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Missing PayPal credentials");
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
        "Failed to get access token:",
        error.response?.data || error
      );
    } else {
      console.error("Failed to get access token:", error);
    }
    throw new Error("Failed to get access token");
  }
};

// Create invoice with authorization header
const createInvoice = async (res: any) => {
  try {
    const accessToken = await getAccessToken(); // Get the access token

    const invoiceData = {
      merchant_info: {
        email: res?.data?.payer?.email_address,
        first_name: "Monir",
        last_name: "Dev",
        business_name: "Mitchell & Murray",
        phone: {
          country_code: "001",
          national_number: "4085551234",
        },
        address: {
          line1: "1234 First Street",
          city: "Anytown",
          state: "CA",
          postal_code: "98765",
          country_code: "US",
        },
      },
      billing_info: [
        {
          email: "bill-me@example.com",
          first_name: res?.data?.payer?.name?.given_name,
          last_name: res?.data?.payer?.name?.surname,
        },
      ],
      shipping_info: {
        first_name: res?.data?.payer?.name?.given_name,
        last_name: res?.data?.payer?.name?.surname,
        address: {
          line1: "1234 Main Street",
          city: "Anytown",
          state: "CA",
          postal_code: "98765",
          country_code: "US",
        },
      },
      items: [
        {
          name: "T-shirt",
          quantity: 1,
          unit_price: {
            currency: "USD",
            value:
              res?.data?.purchase_units[0]?.payments?.captures[0]?.amount
                ?.value,
          },
          tax: {
            name: "Tax",
            percent: 0,
          },
        },
      ],
      discount: {
        percent: 0.0001,
      },
      shipping_cost: {
        amount: {
          currency: "USD",
          value: "0",
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
    const invoice_id = InvoiceRes.data.id;
    const amount =
      res?.data?.purchase_units[0]?.payments?.captures[0]?.amount?.value;
    await markInvoiceAsPaid(invoice_id, accessToken, amount);
    return InvoiceRes.data;
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
  }
};

// mark as paid invoice
const markInvoiceAsPaid = async (
  invoice_id: string,
  accessToken: string,
  amount: string
) => {
  try {
    const formattedDate =
      new Date().toISOString().replace("T", " ").split(".")[0] + " UTC";

    const response = await axios.post(
      `${process.env.PAYPAL_SANDBOX_URL}/v1/invoicing/invoices/${invoice_id}/record-payment`,
      {
        method: "PAYPAL",
        date: formattedDate,
        note: "Payment was processed via PayPal successfully.",
        amount: {
          currency: "USD",
          value: amount,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("✅ Invoice marked as PAID:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "❌ Error marking invoice as paid:",
        error.response?.data || error.message
      );
    } else {
      console.error("❌ Unexpected error:", error);
    }
  }
};
