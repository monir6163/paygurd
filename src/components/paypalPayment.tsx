/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";

export default function PaypalPayment() {
  const [amount, setAmount] = useState<string>("");
  const router = useRouter();
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_CLIECT_ID || "",
    currency: "USD",
    intent: "capture",
  };

  // Create Order
  const onCreateOrder = async () => {
    try {
      const res = await axios.post(
        "/api/paypal",
        { amount },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data.orderId;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error in onCreateOrder:",
          error.response?.data || error.message
        );
        toast.error(error.response?.data?.message || error.message);
      } else {
        console.error("Error in onCreateOrder:", error);
      }
      toast.error("Failed to create PayPal order");
    }
  };

  // onApprove
  const onApprove = async (data: any) => {
    try {
      if (!data.orderID) {
        toast.error("Order ID is required");
        return;
      }
      const res = await axios.get(`/api/paypal?paymentId=${data.orderID}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (res?.data?.data?.status === "COMPLETED") {
        toast.success("Payment successful");
        router.push("/dashboard/complete-payment");
      }
    } catch (error) {
      toast.error(
        "An unexpected error occurred. Please check your PayPal account"
      );
      router.push("/dashboard/cancel-payment");
    }
  };

  // onError
  const onError = (error: any) => {
    console.log("Error in onError:", error);
    toast.error("An unexpected error occurred. Please try again");
    router.push("/dashboard/cancel-payment");
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div>
        <h1>Paypal Payment</h1>
        <div className="flex flex-col gap-2 p-5">
          <Input
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      <PayPalButtons
        style={{ layout: "vertical", shape: "rect" }}
        createOrder={onCreateOrder}
        onApprove={onApprove}
        onError={onError}
        fundingSource="paypal"
      />
    </PayPalScriptProvider>
  );
}
