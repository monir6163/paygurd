"use client";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";
import { Input } from "./ui/input";

export default function PaypalPayment({
  user,
}: {
  user: { email: string; id: string };
}) {
  const [amount, setAmount] = useState<number>(1);

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_CLIECT_ID || "", // ✅ Ensure clientId is set
        currency: "USD",
        intent: "capture",
      }}
    >
      <div>
        <h1>Paypal Payment</h1>
        <div className="flex flex-col gap-2 p-5">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            // only allow positive numbers
            min={1}
          />
        </div>
      </div>
      <PayPalButtons
        style={{ layout: "horizontal" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: amount.toString(),
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (!actions.order) {
            console.error("Order actions not available.");
            return Promise.reject("Order actions not available.");
          }
          const details = await actions.order.capture();
          console.log("Payment Successful!", details);
        }}
      />
    </PayPalScriptProvider>
  );
}
