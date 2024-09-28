import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import axios from "axios";

export const POST = async (req: any) => {
  //   const {} = await req.json();
  let data = {
    messaging_product: "whatsapp",
    to: "918146851290",
    type: "template",
    template: { name: "hello_world", language: { code: "en_US" } },
  };

  await axios.post(
    "https://graph.facebook.com/v20.0/354548651078391/messages",
    data,
    {
      headers: {
        Authorization:
          "Bearer EAALOXn0HUf0BO2pZAt9FbiWi6hGOQht4XVeA79HZA8bs9KGaMkaqhDGyB31cXJ0Hmvwe1B5gznyXPyaANvq9OKiEMqlhGk4fAPjZCylYVDLZCKYyv2gJiku835igwmd7Fzmw9Po5zUrYJxgU5pFZC5TweqReT4DWs9ffGgQQwo4dxq4sutI7mgBP2DxZAEcdO0mndhNlon4jeMZA7cjzbTdGqKB0ulILuBIvoLZBUTl6QSQnXRsBOR96",
      },
    }
  );

  return NextResponse.json({ success: true });
};
