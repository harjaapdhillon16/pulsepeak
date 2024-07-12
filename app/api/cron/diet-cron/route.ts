// @ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabase";
import { NextResponse } from "next/server";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { DateTime } from "luxon";

const token = "7421455490:AAFp-ksnq7xcR8TqrJq1K8YzOJyCOrIakDo";

const weekKeys = {
  0: 7,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
};
const responseTexts = {
  yes_meal: "Yes I had my meal",
  no_meal: "No I skipped my meal",
};

async function getMealsForToday() {
  const dateTime = new Date();
  const currentTime = `${dateTime.getUTCHours()}:${dateTime.getUTCMinutes()}:00`;
  const { data, error } = await supabase
    .from("diets")
    .select(
      `meal_time,actual_meal, user_id (full_name, whatsapp_number, telegram_chat_id), user_id`
    )
    .contains("meal_time", [currentTime]);

  if (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }
  return data.map((_) => ({ ..._, currentTime }));
}

async function sendWhatsAppReminder(phoneNumber, meal, name) {
  try {
    const payload = {
      phoneNumber: phoneNumber,
      parameters: [
        { type: "text", text: name },
        {
          type: "text",
          text: meal,
        },
      ],
      templateName: "diet",
    };

    await axios.post(
      "https://pulsepeak-1ed36d73343d.herokuapp.com/whatsapp-message",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending WhatsApp reminder:", error);
  }
}

const sendTelegramMessage = async (chat_id, meal, name) => {
  await axios.post(
    "https://pulsepeak-1ed36d73343d.herokuapp.com/telegram-message",
    {
      chatId: chat_id,
      message: `Hey ${name},this is your reminder to take your meal - ${meal}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: responseTexts.yes_meal, callback_data: "yes_meal" }],
          [{ text: responseTexts.no_meal, callback_data: "no_meal" }],
        ],
      },
    }
  );
};

export const revalidate = 0;

export const GET = async (req: any, res: NextApiResponse) => {
  const allMeals = await getMealsForToday();

  allMeals.forEach((meal, index) => {
    const { actual_meal, meal_time, user_id, currentTime } = meal;
    const indexForMeal = (meal_time as Array).findIndex(
      (item) => item === currentTime
    );
    const allMeals = actual_meal[indexForMeal];
    if (user_id.telegram_chat_id) {
      setTimeout(() => {
        sendTelegramMessage(
          user_id.telegram_chat_id,
          allMeals,
          user_id.full_name
        );
      }, 40);
      console.log("telegram meal sent", user_id.telegram_chat_id);
    }
    if (user_id.whatsapp_number) {
      sendWhatsAppReminder(
        user_id.whatsapp_number,
        allMeals,
        user_id.full_name
      );
      console.log("whatsapp meal sent", user_id.whatsapp_number);
    }
  });

  return NextResponse.json({ success: true });
};
