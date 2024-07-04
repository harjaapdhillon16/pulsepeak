import axios from "axios";

import { NextResponse } from "next/server";

export const POST = async (req: any) => {
  const { user_id, email } = await req.json();
  let dataToSend = JSON.stringify({
    plan_id: "plan_OUbCVEGaA370XM",
    total_count: 100,
    quantity: 1,
    customer_notify: 1,
    notes: {
      user_id,
      email,
    },
    notify_info: {
      notify_email: email,
    },
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.razorpay.com/v1/subscriptions",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic cnpwX2xpdmVfeTZBNHNOU3lJcVd4YzE6VE9aaTJxUkp0QVY3alc1ZG9yMkpscUZE",
    },
    data: dataToSend,
  };

  const { data } = await axios.request(config);
  return NextResponse.json(data.short_url);
};
