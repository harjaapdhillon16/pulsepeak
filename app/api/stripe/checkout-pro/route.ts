import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_KEY ?? "", {
  apiVersion: "2024-06-20", // Ensure this matches your Stripe API version
});

export async function POST(req: any, res: any) {
  const { redirect_url, user_id } = await req.json();
  console.log({ redirect_url, user_id });

  try {
    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: "price_1PcVX7EmQSouFpqQDwJJFfZz",
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          user_id,
        },
      },
      success_url: redirect_url,
      cancel_url: redirect_url,
    });

    // Return the session ID to the client
    return NextResponse.json(session);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Failed to create checkout session" });
  }
}
