// @ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabase";
import { NextResponse } from "next/server";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";

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
  yes_session: "Yes I attended my session",
  no_session: "No I skipped my session",
  yes_meal: "Yes I had my meal",
  no_meal: "No I skipped my meal",
};

function extractTime(date) {
  console.log(date.split("T"));
  return date.split("T")[1].split(".")[0];
}

function isAfter(date1, date2) {
  return extractTime(date1) > extractTime(date2);
}

function isBefore(date1, date2) {
  return extractTime(date1) < extractTime(date2);
}

function convertToUTC(timeString) {
  // Extract the time and offset parts from the string
  const [timePart, offsetPart] = timeString.split("+");
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  const [offsetHours, offsetMinutes] = offsetPart.split(":").map(Number);

  // Calculate the total offset in milliseconds
  const offsetInMilliseconds = (offsetHours * 60 + offsetMinutes) * 60 * 1000;

  // Create a date object for the time part
  const date = new Date();
  date.setUTCHours(hours, minutes, seconds, 0);

  // Convert the time to UTC by subtracting the offset
  const utcTime = new Date(date.getTime() - offsetInMilliseconds);

  return utcTime.toISOString();
}

function subMinutes(dateTimeString, minutesToAdd) {
  // Parse the input datetime string
  const dateTime = new Date(dateTimeString);

  // Add minutes to the datetime
  dateTime.setUTCMinutes(dateTime.getUTCMinutes() + minutesToAdd);

  // Format the new datetime in ISO 8601 format
  const newDateTimeString = dateTime.toISOString();

  return newDateTimeString;
}

async function getTodayWorkouts() {
  const d = new Date();
  let day = d.getDay();

  const { data, error } = await supabase
    .from("workouts")
    .select(`${day}, user_id (full_name, whatsapp_number, telegram_chat_id)`);

  if (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }

  return data.map((workout) => {
    const workoutTime = convertToUTC(workout[weekKeys[day]]);

    const reminderTime = subMinutes(workoutTime, 30);

    return {
      ...workout,
      workoutTime: workoutTime,
      reminderTime,
    };
  });
}

async function sendWhatsAppReminder(phoneNumber, workoutTime, name) {
  try {
    const url = "https://graph.facebook.com/v19.0/354548651078391/messages";
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const payload = {
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "template",
      template: {
        name: "g",
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: name },
              {
                type: "text",
                text: "(Please set the workouts by going into workout details settings)",
              },
            ],
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

    console.log(
      `Reminder sent to ${phoneNumber} for workout at ${workoutTime}`
    );
  } catch (error) {
    console.error("Error sending WhatsApp reminder:", error);
  }
}

const sendTelegramMessage = (chat_id) => {
  const bot = new TelegramBot(token);
  bot.sendMessage(
    chat_id,
    "This is your reminder to go do your workout which starts in less than 30 minutes and here are the workout details",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: responseTexts.yes_session, callback_data: "yes_session" }],
          [{ text: responseTexts.no_session, callback_data: "no_session" }],
        ],
      },
    }
  );
};

export const POST = async (req: any, res: NextApiResponse) => {
  const workouts = await getTodayWorkouts();
  console.log({ workouts });
  workouts.forEach((workout) => {
    const { reminderTime, workoutTime, user_id, timeZone } = workout;
    const {
      full_name: name,
      whatsapp_number: phoneNumber,
      telegram_chat_id: chat_id,
    } = user_id;
    const currentLocalTime = new Date();
    console.log({
      currentLocalTime: currentLocalTime.toISOString(),
      workoutTime,
      reminderTime,
    });
    if (
      isAfter(reminderTime, currentLocalTime.toISOString()) &&
      isBefore(currentLocalTime.toISOString(), workoutTime)
    ) {
      if (phoneNumber) {
        sendWhatsAppReminder(phoneNumber, workoutTime, name);
      }
      if (chat_id) {
        console.log({ chat_id });
        sendTelegramMessage(chat_id);
      }
    }
  });

  return NextResponse.json({ success: true });
};
