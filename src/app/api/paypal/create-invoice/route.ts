/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAccessToken } from "@/lib/getAccessToken";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    const bodyData = await request.json();
    const { merchantInfo, billTo, items, note } = bodyData;

    const invoiceData = {
      detail: {
        invoice_number:
          merchantInfo?.invoice || Math.floor(Math.random() * 1000),
        invoice_date: merchantInfo?.date,
        currency_code: merchantInfo?.currency || "USD",
        note: note || "",
        payment_term: {
          term_type: "NET_10",
          due_date: new Date(
            new Date(merchantInfo?.date).setDate(
              new Date(merchantInfo?.date).getDate() + 10
            )
          )
            .toISOString()
            .split("T")[0],
        },
      },

      invoicer: {
        name: {
          given_name: merchantInfo?.name,
          surname: merchantInfo?.company,
        },
        email_address: merchantInfo?.email,
      },

      primary_recipients: [
        {
          billing_info: {
            name: {
              given_name: billTo?.first_name,
              surname: billTo?.last_name,
            },
            email_address: billTo?.email,
          },
          shipping_info: {
            name: {
              given_name: billTo?.first_name,
              surname: billTo?.last_name,
            },
          },
        },
      ],
      items: items?.map((item: any) => ({
        name: item.item,
        quantity: item.quantity,
        unit_amount: {
          currency_code: merchantInfo?.currency,
          value: item.price,
        },
      })),

      note: billTo?.recipient,
    };

    const InvoiceRes = await axios.post(
      `${process.env.PAYPAL_SANDBOX_URL}/v2/invoicing/invoices`,
      invoiceData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // store the invoice id in the database
    if (InvoiceRes?.data) {
      return NextResponse.json({
        message: "Invoice created successfully",
        data: InvoiceRes.data,
        status: 200,
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating invoice:",
        (error as any).response?.data || (error as Error).message
      );
      return NextResponse.json({
        message: (error as any).response?.data || (error as Error).message,
        status: 500,
      });
    } else {
      console.error("Error creating invoice:", error);
    }
    return NextResponse.json({
      message: "Failed to create invoice",
      status: 500,
    });
  }
}
