import axios from "axios";

import { NextResponse } from "next/server";

export const POST = async (req: any) => {
  const { user_id, email } = await req.json();
  let dataToSend = JSON.stringify({
    plan_id: "price_1PcVX7EmQSouFpqQDwJJFfZz",
    total_count: 100,
    quantity: 1,
    customer_notify: 1,
    notes: {
      user_id,
      email,
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

  let dataToSend2 = JSON.stringify({
    plan_id: "plan_OVthO0Amr88vNv",
    total_count: 100,
    quantity: 1,
    customer_notify: 1,
    notes: {
      user_id,
      email,
    },
  });

  let config2 = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.razorpay.com/v1/subscriptions",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic cnpwX2xpdmVfeTZBNHNOU3lJcVd4YzE6VE9aaTJxUkp0QVY3alc1ZG9yMkpscUZE",
    },
    data: dataToSend2,
  };

  const promise1 = axios.request(config);
  const promise2 = axios.request(config2);
  const promiseResults = await Promise.all([promise1, promise2]);

  return NextResponse.json({
    telegram_url: promiseResults[0].data.short_url,
    whatsapp_url: promiseResults[1].data.short_url,
  });
};
