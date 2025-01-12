/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default function Thankyou() {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");
  const paymentRes = searchParams.get("payId");
  const [loading, setLoading] = useState(true);
  const [payData, setPayData] = useState<any>(null);

  useEffect(() => {
    async function getPaymentData() {
      try {
        const { data } = await axios.get(
          `/api/payments/invoice?user_id=${userId}&pay_id=${paymentRes}`
        );
        if (data?.status === 200) {
          setPayData(data?.data);
        }
      } catch (error: any) {
        toast.error(error.message);
        if (error.response?.status === 400) {
          navigate.push("/dashboard");
        }
      } finally {
        setLoading(false);
      }
    }
    getPaymentData();
  }, [userId, paymentRes, navigate]);

  //   invoice download

  const handleDownloadInvoice = async () => {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();

    // Embed the Times Roman font
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    // Add a blank page to the document
    const page = pdfDoc.addPage();

    // Get the width and height of the page
    const { height } = page.getSize();

    // Draw text on the page
    const fontSize = 30;
    page.drawText("Invoice", {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71), // Blue color
    });
    page.drawText(`Invoice ID: ${payData?.id}`, {
      x: 50,
      y: height - 6 * fontSize,
      size: 20,
      font: timesRomanFont,
    });
    page.drawText(`Title: ${payData?.title}`, {
      x: 50,
      y: height - 8 * fontSize,
      size: 20,
      font: timesRomanFont,
    });
    page.drawText(`Amount: $${payData?.amount}`, {
      x: 50,
      y: height - 10 * fontSize,
      size: 20,
      font: timesRomanFont,
    });
    page.drawText(`Status: ${payData?.status}`, {
      x: 50,
      y: height - 12 * fontSize,
      size: 20,
      font: timesRomanFont,
    });
    page.drawText(`Email: ${payData?.user_profiles?.email}`, {
      x: 50,
      y: height - 14 * fontSize,
      size: 20,
      font: timesRomanFont,
    });
    page.drawText(`Date: ${new Date(payData?.created_at).toDateString()}`, {
      x: 50,
      y: height - 16 * fontSize,
      size: 20,
      font: timesRomanFont,
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Create a Blob from the PDF bytes
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

    // Create a download link for the Blob and trigger the download
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `Invoice-${Math.random().toString(36).substring(7)}.pdf`; // File name for download
    document.body.appendChild(a);
    a.click();

    // Clean up by revoking the Blob URL
    URL.revokeObjectURL(pdfUrl);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
          🎉 Thank You!
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Your payment has been processed successfully.
        </p>
        <div className="border-t border-gray-200 my-4"></div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">User ID:</span>
            <span className="text-gray-700">{userId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Payment ID:</span>
            <span className="text-gray-700">{payData?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Amount:</span>
            <span className="text-gray-700">${payData?.amount}</span>
          </div>
        </div>
        <div className="mt-6 flex flex-col space-y-3">
          <button
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={() => navigate.push("/dashboard/payments")}
          >
            Back to Payments
          </button>
          <button
            className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
            disabled={!payData}
            onClick={handleDownloadInvoice}
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
