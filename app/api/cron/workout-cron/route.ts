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
  yes_session: "Yes I will attend my session",
  no_session: "No I am skipping my session",
  yes_meal: "Yes I had my meal",
  no_meal: "No I skipped my meal",
};

function extractTime(date) {
  return new Date(date).getTime();
}

function isBefore(date1, date2) {
  return extractTime(date1) < extractTime(date2);
}

function calculateDateTimeFromOffset(timeString) {
  // Extract time and offset from the input string
  let [time, offsetString] = timeString.includes("-")
    ? timeString.split("-")
    : timeString.split("+");
  let [hours, minutes, seconds] = time
    .split(":")
    .map((num) => parseInt(num, 10));
  console.log({ offsetString });
  // Calculate the total offset in minutes
  let offsetParts = offsetString.split(":");
  let offsetHours = parseInt(offsetParts[0], 10);
  let offsetMinutes = parseInt(offsetParts?.[1] ?? "00", 10);
  let totalOffsetMinutes = timeString.includes("-")
    ? -1 * offsetHours * 60 + -1 * offsetMinutes
    : offsetHours * 60 + offsetMinutes;

  // Get current DateTime in UTC
  let utcDateTime = DateTime.utc();

  // Calculate the total offset in milliseconds
  let offsetMilliseconds = totalOffsetMinutes * 60 * 1000;

  // Create new DateTime adjusted by the offset
  let localDateTime = utcDateTime.plus({ milliseconds: offsetMilliseconds });

  // Set the time to the provided hours, minutes, and seconds
  localDateTime = localDateTime.set({
    hour: hours,
    minute: minutes,
    second: seconds,
  });

  return new Date(localDateTime);
}

function subMinutes(dateTimeString, minutesToSubtract) {
  const dateTime = new Date(dateTimeString);
  dateTime.setUTCMinutes(dateTime.getUTCMinutes() - minutesToSubtract);
  return dateTime.toISOString();
}

function getCurrentDateTimeISOWithOffset(timeString) {
  // Example timeString format: "03:54:00+05:30"
  const [timePart, offsetPart] = timeString.includes("+")
    ? timeString.split("+")
    : timeString.split("-");
  function calculateMinuteOffset(offsetString) {
    // Split the offset string into hours and minutes parts
    let parts = offsetString?.split(":");
    // Parse hours and minutes from the parts array
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts?.[1] ?? "00", 10);

    // Calculate total offset in minutes
    let totalOffset = timeString.split("-")
      ? -1 * hours * 60 + -1 * minutes
      : hours * 60 + minutes;

    return totalOffset;
  }
  // Get current DateTime object in UTC
  let utcDateTime = DateTime.utc();
  // Add the offset in minutes
  let localDateTime = utcDateTime.plus({
    minutes: calculateMinuteOffset(offsetPart),
  });

  return new Date(localDateTime);
}

async function getTodayWorkouts() {
  const { data, error } = await supabase
    .from("workouts")
    .select(
      `1,2,3,4,5,6,7, user_id (full_name, whatsapp_number, telegram_chat_id)`
    );

  if (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }

  return data
    .map((workout) => {
      const dayToGet =
        getCurrentDateTimeISOWithOffset(
          workout[1] ??
            workout[2] ??
            workout[3] ??
            workout[4] ??
            workout[5] ??
            workout[6] ??
            workout[7]
        ).getDay() === 0
          ? 1
          : getCurrentDateTimeISOWithOffset(
              workout[1] ??
                workout[2] ??
                workout[3] ??
                workout[4] ??
                workout[5] ??
                workout[6] ??
                workout[7]
            ).getDay() + 1;
      const workoutTime = workout[weekKeys[dayToGet]]
        ? calculateDateTimeFromOffset(workout[weekKeys[dayToGet]])
        : null;
      if (workoutTime) {
        const reminderTime = subMinutes(workoutTime, 30);
        const reminderTime1 = subMinutes(workoutTime, 25);

        return {
          ...workout,
          workoutTime,
          reminderTime,
          reminderTime1,
          time: workout[weekKeys[dayToGet]],
        };
      } else {
        return null;
      }
    })
    .filter((item) => item !== null);
}

async function sendWhatsAppReminder(phoneNumber, workoutTime, name) {
  try {
    const url = "https://graph.facebook.com/v19.0/354548651078391/messages";
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
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

export const revalidate = 0;

export const GET = async (req: any, res: NextApiResponse) => {
  const workouts = await getTodayWorkouts();

  workouts.forEach((workout, index) => {
    const { reminderTime, workoutTime, user_id, reminderTime1, time } = workout;
    console.log({ time });
    const currentTimeUTC = getCurrentDateTimeISOWithOffset(time);

    const {
      full_name: name,
      whatsapp_number: phoneNumber,
      telegram_chat_id: chat_id,
    } = user_id;

    console.log(
      "Workout Time Comparison:",
      {
        reminderTime,
        workoutTime,
        currentTimeUTC,
        reminderTime1,
      },
      isBefore(reminderTime, currentTimeUTC),
      isBefore(currentTimeUTC, reminderTime1)
    );

    if (
      isBefore(reminderTime, currentTimeUTC) &&
      isBefore(currentTimeUTC, reminderTime1)
    ) {
      if (phoneNumber) {
        sendWhatsAppReminder(phoneNumber, workoutTime, name);
        console.log("sending WhatsApp", phoneNumber);
      }
      if (chat_id) {
        setTimeout(() => {
          sendTelegramMessage(chat_id);
        }, index * 40);
        console.log("sending Telegram", chat_id);
      }
    } else {
    }
  });

  return NextResponse.json({ success: true });
};
