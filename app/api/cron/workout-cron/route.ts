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
  yes_session: "Yes I will attend my session",
  no_session: "No I am skipping my session",
  yes_meal: "Yes I had my meal",
  no_meal: "No I skipped my meal",
};

function extractTime(date) {
  const dateInMillisecond = new Date(date).getTime();
  return dateInMillisecond;
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

function subMinutes(dateTimeString, minutesToSubtract) {
  // Parse the input datetime string
  const dateTime = new Date(dateTimeString);

  // Subtract minutes from the datetime
  dateTime.setUTCMinutes(dateTime.getUTCMinutes() - minutesToSubtract);

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
    const reminderTime1 = subMinutes(workoutTime, 25);

    return {
      ...workout,
      workoutTime: workoutTime,
      reminderTime,
      reminderTime1,
    };
  });
}

async function sendWhatsAppReminder(phoneNumber, workoutTime, name) {
  try {
    const payload = {
      phoneNumber: phoneNumber,
      parameters: [
        { type: "text", text: name },
        {
          type: "text",
          text: "(Please set the workouts by going into workout details settings)",
        },
      ],
      templateName: "g",
    };

    await axios.post("https://pulsepeak-1ed36d73343d.herokuapp.com/whatsapp-message", payload);
  } catch (error) {
    console.error("Error sending WhatsApp reminder:", error);
  }
}

const sendTelegramMessage = async (chat_id) => {
  await axios.post(
    "https://pulsepeak-1ed36d73343d.herokuapp.com/telegram-message",
    {
      chatId: chat_id,
      message:
        "This is your reminder to go do your workout which starts in less than 30 minutes",
      reply_markup: {
        inline_keyboard: [
          [{ text: responseTexts.yes_session, callback_data: "yes_session" }],
          [{ text: responseTexts.no_session, callback_data: "no_session" }],
        ],
      },
    }
  );
};

function getCurrentTimeWithOffset() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(
    2,
    "0"
  );
  const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
}
export const revalidate = 0;

export const GET = async (req: any, res: NextApiResponse) => {
  const workouts = await getTodayWorkouts();
  workouts.forEach((workout, index) => {
    const { reminderTime, workoutTime, user_id, reminderTime1 } = workout;
    const {
      full_name: name,
      whatsapp_number: phoneNumber,
      telegram_chat_id: chat_id,
    } = user_id;
    const currentLocalTimeUTC = convertToUTC(getCurrentTimeWithOffset());
    console.log(
      isBefore(reminderTime, currentLocalTimeUTC),
      isBefore(currentLocalTimeUTC, workoutTime),
      isBefore(currentLocalTimeUTC, reminderTime1),
      {
        workoutTime,
        reminderTime,
        currentLocalTimeUTC,
        reminderTime1,
      }
    );

    if (
      isBefore(reminderTime, currentLocalTimeUTC) &&
      isBefore(currentLocalTimeUTC, reminderTime1)
    ) {
      if (phoneNumber) {
        sendWhatsAppReminder(phoneNumber, workoutTime, name);
        console.log("sending whatsapp");
      }
      if (chat_id) {
        setTimeout(() => {
          sendTelegramMessage(chat_id);
          console.log("sending telegram");
        }, index * 40);
      }
    } else {
      console.log("not sent (reminderTime1 condition)");
    }
  });

  return NextResponse.json({ success: true });
};
