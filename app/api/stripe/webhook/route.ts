import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: any, res: any) {
  const event = await req.json();
  console.log(event.type);

  // Handle the event
  switch (event.type) {
    case "invoice.paid":
      const paymentIntent = event.data.object;
      console.log(paymentIntent);
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.NEXT_SECRET_SUPABASE_KEY ?? ""
      );
      const { error } = await supabase.from("subscriptions").insert({
        user_id: parseInt(paymentIntent.subscription_details.metadata.user_id),
        razorpay_data: paymentIntent,
      });
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
