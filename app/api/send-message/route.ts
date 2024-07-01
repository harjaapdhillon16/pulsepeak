import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import axios from "axios";

export const POST = async (req: any) => {
  //   const {} = await req.json();
  let data = {
    messaging_product: "whatsapp",
    to: "+918146851290",
    type: "template",
    template: {
      name: "hello_world",
      language: {
        code: "en_US",
      },
    },
  };

  await axios.post(
    "https://graph.facebook.com/v19.0/378211785365521/messages",
    data,
    {
      headers: {
        Authorization:
          "Bearer EAAMTUZAEoNI0BO8rT33ZAqjvzZCXhZBNi2iu94VuHU0AhtqWavZByqqYxLaRleYdrucrYiSOCeoePM4ZBv5nyVHYZAZBRTsgVq8OOZAxTZAhYecmcUm9kB9wkuw5I2Yj6Bmmt3DGetTGOZC1zD2OZA4lm3gCDRHknJICu3iq0AhsmiMwqRKSPwmFElvrP2w4LfrAS3F01MEhRzJy7euA4u787ufNsZBKc1ncZD",
      },
    }
  );

  return NextResponse.json({ success: true });
};
