/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import { toast } from "sonner";

export default function InvoiceDetails() {
  const params = useParams()?.id;
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState<any>({
    due_amount: 0,
    status: "",
    invoice_number: 0,
    invoice_date: "",
    due_date: "",
    note: "",
    billTo: {
      email: "",
      full_name: "",
    },
    invoicer: {
      email_address: "",
      name: {
        given_name: "",
        surname: "",
      },
    },
    items: [],
  });
  const invoiceRef = useRef(null);
  console.log(invoiceData);
  useEffect(() => {
    async function getInvoiceDetails() {
      try {
        const { data } = await axios.get(
          `/api/paypal/invoice-details?invoice_id=${params}`
        );

        const invoice = data?.invoices;

        setInvoiceData({
          due_amount: invoice?.due_amount?.value,
          status: invoice?.status,
          invoice_number: invoice?.detail?.invoice_number,
          invoice_date: invoice?.detail?.invoice_date,
          due_date: invoice?.detail?.payment_term?.due_date,
          note: invoice?.detail?.note,
          billTo: {
            email: invoice?.primary_recipients[0]?.billing_info?.email_address,
            full_name: `${invoice?.primary_recipients[0]?.billing_info?.name?.given_name} ${invoice?.primary_recipients[0]?.billing_info?.name?.surname}`,
          },
          invoicer: {
            email_address: invoice?.invoicer?.email_address,
            name: {
              given_name: invoice?.invoicer?.name?.given_name,
              surname: invoice?.invoicer?.name?.surname,
            },
          },
          items: invoice?.items?.map((item: any) => ({
            name: item?.name,
            quantity: item?.quantity,
            unit_amount: item?.unit_amount?.value,
          })),
        });
      } catch (error) {
        console.error("Error fetching invoice:", error);
        if (axios.isAxiosError(error) && error.response) {
          toast.error(
            error.response.data?.error || "An unexpected error occurred"
          );
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    if (params) getInvoiceDetails();
  }, [params]);

  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) {
      console.error("Invoice element is null");
      return;
    }

    // Wait for the PayPal logo image to load before rendering
    const logoImg = new Image();
    logoImg.src =
      "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg";

    logoImg.onload = async () => {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${invoiceData?.invoice_number}.pdf`);
    };

    logoImg.onerror = () => {
      console.error("Failed to load PayPal logo.");
    };
  };

  if (loading) return <p>Loading invoice...</p>;
  return (
    <div>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation and Actions */}
          <div className="flex justify-between items-center mb-8 print:hidden">
            <Link
              href="/dashboard/invoices"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Back to invoices"
            >
              <FiArrowLeft className="mr-2" />
              Back to Invoices
            </Link>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              aria-label="Download PDF"
            >
              <FiDownload className="mr-2" />
              Download PDF
            </button>
          </div>

          <div className="p-10" ref={invoiceRef}>
            <div className="max-w-2xl mx-auto bg-white p-8 shadow-md">
              <div className="flex justify-between items-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  className="h-10"
                  alt="PayPal Logo"
                />
                <div className="text-right">
                  <h1 className="text-2xl font-bold">INVOICE</h1>
                  <p className="text-gray-500">
                    {invoiceData?.invoicer?.name?.given_name}{" "}
                  </p>
                  <p className="text-gray-500">
                    {invoiceData?.invoicer?.email_address}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 p-4 bg-gray-100 rounded">
                <div>
                  <p>
                    <span className="font-bold">Invoice No#:</span>{" "}
                    {invoiceData?.invoice_number}
                  </p>
                  <p>
                    <span className="font-bold">Invoice Date:</span>{" "}
                    {invoiceData?.invoice_date}
                  </p>
                  <p>
                    <span className="font-bold">Due Date:</span>{" "}
                    {invoiceData?.due_date}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-bold">
                      ${invoiceData?.due_amount || 0}
                    </span>
                  </p>
                  <p>
                    <span className="font-bold">Due Amount</span>
                  </p>
                  <p className="text-center bg-green-100 text-green-600 p-2 rounded">
                    <span className="font-bold">
                      {invoiceData?.status.replace(/_/g, " ")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="font-bold">BILL TO</p>
                <p>{invoiceData?.billTo?.full_name} </p>
                <p>{invoiceData?.billTo?.email} </p>
              </div>

              <table className="w-full mt-6 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">#</th>
                    <th className="border border-gray-300 p-2 text-left">
                      ITEMS
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      QTY
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      PRICE
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      AMOUNT(S)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData?.items?.map((item: any, index: number) => (
                    <tr key={index} className="bg-white">
                      <td className="border border-gray-300 p-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {item.name}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 p-2">
                        ${item.unit_amount}
                      </td>
                      <td className="border border-gray-300 p-2">
                        ${item.quantity * item.unit_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 flex justify-between items-center">
                <div className="text-left">
                  <p className="font-bold">Note</p>
                  <p>{invoiceData?.note}</p>
                </div>

                <div className="text-right">
                  <p className="mb-5">
                    Subtotal:{" "}
                    <span className="font-bold">
                      $
                      {invoiceData?.items.reduce(
                        (acc: number, item: any) =>
                          acc + item.quantity * item.unit_amount,
                        0
                      )}
                    </span>
                  </p>
                  <p className="text-xl font-bold">
                    TOTAL: $
                    {invoiceData?.items.reduce(
                      (acc: number, item: any) =>
                        acc + item.quantity * item.unit_amount,
                      0
                    )}
                    USD
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
