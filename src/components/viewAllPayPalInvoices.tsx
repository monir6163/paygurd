/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
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

  if (loading) return <p>Loading invoices...</p>;
  return (
    <div>
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
                {invoice.primary_recipients[0]?.billing_info?.name?.full_name ||
                  "N/A"}
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
                  <Button onClick={() => deleteInvoice(invoice.id)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
