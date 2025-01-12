/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { amount, currency } = await request.json();

  if (!amount || !currency) {
    return NextResponse.json(
      { error: "Amount and currency are required" },
      { status: 400 }
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount, 10) * 100, // Convert to cents
      currency,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
