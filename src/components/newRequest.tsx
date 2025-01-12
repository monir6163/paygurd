/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewRequestProps } from "@/lib/types";
import LoadingButton from "./loadingButton";
import { paymentRequestSchema } from "../../utils/zod/paymentRequest.types";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PaymentForm({ user }: any) {
  const navigate = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const form = useForm({
    resolver: zodResolver(paymentRequestSchema),
    defaultValues: {
      title: "",
      amount: "",
    },
  });

  async function onSubmit(data: NewRequestProps) {
    data.status = "pending";
    data.user_id = user.id;

    try {
      setIsSubmitting(true);

      // Create Payment Intent
      const res = await fetch("/api/payments/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: "usd",
        }),
      });

      const { clientSecret } = await res.json();

      if (!clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      // Confirm Payment with CardElement
      const cardElement = elements?.getElement(CardElement);
      if (!cardElement) {
        throw new Error("CardElement not found");
      }

      const result = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result?.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      if (result?.paymentIntent?.status === "succeeded") {
        // Finalize Payment Request in the Database
        const { data: paymentRes } = await axios.post("/api/payments", data);
        if (paymentRes?.status === 201) {
          form.reset();
          toast.success("Payment request created and completed");
          setIsSubmitting(false);
          navigate.push(
            `/dashboard/thank-you?user_id=${user.id}&payId=${paymentRes.data.id}`
          );
        } else {
          throw new Error("Failed to save payment request");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Payment Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  backgroundColor: "#fff",
                  padding: "10px 14px",
                  color: "#32325d",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#fa755a" },
              },
            }}
          />
        </div>
        <LoadingButton
          loading={isSubmitting}
          type="submit"
          className="w-full mt-5"
        >
          Send Payment Request
        </LoadingButton>
      </form>
    </Form>
  );
}

export default function NewRequest({ user }: any) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm user={user} />
    </Elements>
  );
}
