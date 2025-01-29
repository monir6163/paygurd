/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function ViewAllPayPalInvoices() {
  interface Invoice {
    id: string;
    primary_recipients: {
      billing_info: {
        name: {
          given_name: string;
        };
      };
    }[];
    amount: {
      value: string;
      currency_code: string;
    };
    status: string;
    detail: {
      invoice_date: string;
    };
  }

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // function to get all invoices
  async function getAllInvoices() {
    try {
      const { data } = await axios.get("/api/paypal/invoices");
      setInvoices(data?.invoices?.items || []);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getAllInvoices();
  }, []);

  // delete invoice
  async function deleteInvoice(invoiceId: string) {
    try {
      await axios.get(
        `/api/paypal/draft-invoice-delete?invoice_id=${invoiceId}`
      );
      toast.success("Invoice deleted successfully");
      getAllInvoices();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }
  if (loading) return <p>Loading invoices...</p>;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All PayPal Invoices</h1>
        <Link
          href="/dashboard/invoices/create-invoice"
          className="bg-black text-white px-2 py-1 rounded-md hover:bg-gray-800"
        >
          Create Invoice
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-base text-black">
              Invoice ID
            </TableHead>
            <TableHead className="font-bold text-base text-black">
              Name
            </TableHead>
            <TableHead className="font-bold text-base text-black">
              Amount
            </TableHead>
            <TableHead className="font-bold text-base text-black">
              Status
            </TableHead>
            <TableHead className="font-bold text-base text-black">
              Date
            </TableHead>
            <TableHead className="font-bold text-base text-black">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.length > 0 ? (
            invoices?.map((invoice: any) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>
                  {invoice?.primary_recipients?.[0]?.billing_info?.name
                    ?.full_name || "N/A"}
                </TableCell>
                <TableCell>
                  {invoice?.amount?.value} {invoice?.amount?.currency_code}
                </TableCell>
                <TableCell className="capitalize">
                  {invoice.status.replace(/_/g, " ")}
                </TableCell>
                <TableCell>{invoice?.detail?.invoice_date || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/invoices/${invoice.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black text-white px-2 py-1 rounded-md hover:bg-yellow-800"
                    >
                      View
                    </Link>
                    <button
                      className="bg-black text-white px-2 py-1 rounded-md hover:bg-red-800"
                      onClick={() => deleteInvoice(invoice.id)}
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No invoices found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
