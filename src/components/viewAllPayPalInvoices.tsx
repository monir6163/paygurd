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
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);

  // function to get all invoices
  async function getAllInvoices() {
    try {
      const { data } = await axios.get("/api/paypal/invoices");
      setInvoices(data?.invoices?.items);
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

  // create invoice

  const createInvoice = async () => {
    try {
      setLoader(true);
      const { data } = await axios.post("/api/paypal/create-invoice");
      if (data) {
        toast.success("Invoice created successfully");
        getAllInvoices();
      }
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
      toast.error("Failed to create invoice");
    } finally {
      setLoader(false);
    }
  };

  if (loading) return <p>Loading invoices...</p>;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All PayPal Invoices</h1>
        <button
          onClick={createInvoice}
          className="bg-black text-white px-4 py-2 rounded-md"
          disabled={loader}
        >
          {loader ? "Creating..." : "Create Invoice"}
        </button>
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
          {invoices?.map((invoice: any) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>
                {invoice?.primary_recipients[0]?.billing_info?.name
                  ?.full_name || "N/A"}
              </TableCell>
              <TableCell>
                ${invoice.amount.value} {invoice.amount.currency_code}
              </TableCell>
              <TableCell className="capitalize">
                {invoice.status.replace(/_/g, " ")}
              </TableCell>
              <TableCell>{invoice.detail.invoice_date}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                    bg-black text-white px-2 py-1 rounded-md
                   "
                  >
                    View
                  </Link>
                  <button
                    className="
                    bg-black text-white px-2 py-1 rounded-md
                   "
                    onClick={() => deleteInvoice(invoice.id)}
                  >
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
