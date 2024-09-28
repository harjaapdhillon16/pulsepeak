import axios from "axios";

export const sendMessage = async ({
  templateName,
  phoneNumber,
  parameters,
}: any) => {
  const url = "https://graph.facebook.com/v19.0/354548651078391/messages";
  const token =
    "EAALOXn0HUf0BO0nOBj8L7efXM17DMAa28WZC13I97x68JomqYsM8JZAo6jbf1VGheWmQBv3ABQJ5J1MaGptLUzdNlbt3rZADU0RPHt06TCTHAljW6w2X1xZACDCkjhbvgrp0nyZBtf3ha7LfwrL374p53IUhznMM7pVVO1FU0ZCm8rnwh8x1L5UdchMgKmEfE9t5ZBknZB02Mte8moKG";
  const payload = {
    messaging_product: "whatsapp",
    to: phoneNumber,
    type: "template",
    template: {
      name: templateName,
      components: [
        {
          type: "body",
          parameters: parameters,
        },
      ],
      language: { code: "en" },
    },
  };

  await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
