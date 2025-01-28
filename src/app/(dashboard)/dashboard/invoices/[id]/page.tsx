/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { format } from "date-fns";
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
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    draftDate: "",
    status: "",
    business: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      email: "",
      phone: "",
    },
    recipient: {
      name: "",
      billingAddress: "",
      billingCity: "",
      billingState: "",
      billingZip: "",
      email: "",
    },
    items: [],
    payment: {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      method: "",
      date: "",
      transactionId: "",
      note: "",
    },
  });
  const invoiceRef = useRef(null);
  useEffect(() => {
    async function getInvoiceDetails() {
      try {
        const { data } = await axios.get(
          `/api/paypal/invoice-details?invoice_id=${params}`
        );

        const invoice = data?.invoices;

        setInvoiceData({
          invoiceNumber: invoice?.detail?.invoice_number || "N/A",
          invoiceDate: invoice?.detail?.invoice_date || "",
          draftDate: invoice?.detail?.invoice_date || "",
          status: invoice?.status || "Pending",
          business: {
            name: invoice?.invoicer?.business_name || "N/A",
            address: invoice?.invoicer?.address?.address_line_1 || "",
            city: invoice?.invoicer?.address?.admin_area_2 || "",
            state: invoice?.invoicer?.address?.admin_area_1 || "",
            zip: invoice?.invoicer?.address?.postal_code || "",
            email: invoice?.invoicer?.email_address || "",
            phone:
              invoice?.invoicer?.phones?.[0]?.phone_number?.national_number ||
              "",
          },
          recipient: {
            name:
              invoice?.primary_recipients?.[0]?.billing_info?.name?.full_name ||
              "N/A",
            billingAddress:
              invoice?.primary_recipients?.[0]?.shipping_info?.address
                ?.address_line_1 || "",
            billingCity:
              invoice?.primary_recipients?.[0]?.shipping_info?.address
                ?.admin_area_2 || "",
            billingState:
              invoice?.primary_recipients?.[0]?.shipping_info?.address
                ?.admin_area_1 || "",
            billingZip:
              invoice?.primary_recipients?.[0]?.shipping_info?.address
                ?.postal_code || "",
            email:
              invoice?.primary_recipients?.[0]?.billing_info?.email_address ||
              "",
          },
          items:
            invoice?.items?.map((item: any) => ({
              name: item?.name || "N/A",
              quantity: parseInt(item?.quantity) || 1,
              unitPrice: parseFloat(item?.unit_amount?.value) || 0,
              total:
                parseFloat(item?.unit_amount?.value) *
                  parseInt(item?.quantity) || 0,
            })) || [],
          payment: {
            subtotal:
              parseFloat(invoice?.amount?.breakdown?.item_total?.value) || 0,
            tax: parseFloat(invoice?.amount?.breakdown?.tax_total?.value) || 0,
            shipping:
              parseFloat(invoice?.amount?.breakdown?.shipping?.amount?.value) ||
              0,
            total: parseFloat(invoice?.amount?.value) || 0,
            method: invoice?.payments?.transactions?.[0]?.method || "PayPal",
            date: invoice?.payments?.transactions?.[0]?.payment_date || "",
            transactionId: invoice?.id || "N/A",
            note: invoice?.payments?.transactions?.[0]?.note || "",
          },
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
    if (element) {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${invoiceData?.invoiceNumber}.pdf`);
    } else {
      console.error("Invoice element is null");
    }
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
          <div ref={invoiceRef}>
            {/* Invoice Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Invoice #{invoiceData.invoiceNumber}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Date:{" "}
                    {format(
                      new Date(
                        invoiceData.invoiceDate || invoiceData.draftDate
                      ),
                      "MMMM dd, yyyy"
                    )}
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  {invoiceData.status}
                </div>
              </div>
            </div>

            {/* Business and Recipient Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  From
                </h2>
                <div className="text-gray-600">
                  <p className="font-medium text-gray-900">
                    {invoiceData.business.name}
                  </p>
                  <p>{invoiceData.business.address}</p>
                  <p>
                    {invoiceData.business.city}, {invoiceData.business.state}{" "}
                    {invoiceData.business.zip}
                  </p>
                  <p className="mt-2">{invoiceData.business.email}</p>
                  <p>{invoiceData.business.phone}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">To</h2>
                <div className="text-gray-600">
                  <p className="font-medium text-gray-900">
                    {invoiceData.recipient.name}
                  </p>
                  <p>{invoiceData.recipient.billingAddress}</p>
                  <p>
                    {invoiceData.recipient.billingCity},{" "}
                    {invoiceData.recipient.billingState}{" "}
                    {invoiceData.recipient.billingZip}
                  </p>
                  <p className="mt-2">{invoiceData.recipient.email}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoiceData?.items.map((item: any, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ${invoiceData.payment.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">
                    ${invoiceData.payment.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    ${invoiceData.payment.shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${invoiceData.payment.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {invoiceData.payment.method}
                </p>
                <p>
                  <span className="font-medium">Payment Date:</span>{" "}
                  {format(
                    new Date(invoiceData.payment.date || invoiceData.draftDate),
                    "MMMM dd, yyyy"
                  )}
                </p>
                <p>
                  <span className="font-medium">INV-Generate ID:</span>{" "}
                  {invoiceData.payment.transactionId}
                </p>
                <p className="text-green-600">{invoiceData.payment.note}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
