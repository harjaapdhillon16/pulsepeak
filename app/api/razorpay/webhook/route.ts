import { createClient } from "@supabase/supabase-js";

import { NextResponse } from "next/server";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export const POST = async (req: any) => {
  const data = await req.json();
  const webhookSignature: any = req.headers.get("X-Razorpay-Signature");
  console.log(data);
  console.log({
    bool: validateWebhookSignature(
      JSON.stringify(data),
      webhookSignature,
      "secret"
    ),
    data: JSON.stringify(data.payload),
  });
  if (
    validateWebhookSignature(JSON.stringify(data), webhookSignature, "secret")
  ) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_SECRET_SUPABASE_KEY ?? ""
    );
    const { error } = await supabase.from("subscriptions").insert({
      user_id: data.payload.subscription.entity.notes.user_id,
      razorpay_data: data,
    });
    console.log(error);
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { error: true },
      {
        status: 500,
      }
    );
  }
};
