// @ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabase";
import { NextResponse } from "next/server";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { DateTime } from "luxon";
import { sendMessage } from "@/utils/sendMessage";

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

function isBetween0And1MinutesApart(date1, date2) {
  const timeDifference = Math.abs(extractTime(date1) - extractTime(date2));
  const oneMinuteInMs = 1 * 60 * 1000; // 1 minute in milliseconds
  const zeroMinutesInMs = 0; // 0 minutes in milliseconds

  return timeDifference >= zeroMinutesInMs && timeDifference <= oneMinuteInMs;
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
    second: 0,
  });

  return new Date(localDateTime);
}

function subMinutes(dateTimeString, minutesToSubtract) {
  const dateTime = new Date(dateTimeString);
  dateTime.setUTCMinutes(dateTime.getUTCMinutes() - minutesToSubtract);
  return dateTime.toISOString();
}

function getCurrentDateTimeISOWithOffset(timeString) {
  // Example timeString format: "03:54:00+05:30" or "03:54:00-07:00"
  const [timePart, offsetPart] = timeString.includes("+")
    ? timeString.split("+")
    : timeString.split("-");

  const isNegativeOffset = timeString.includes("-");

  function calculateMinuteOffset(offsetString, isNegative) {
    const parts = offsetString.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1] || "00", 10);

    // Calculate total offset in minutes (handle negative if needed)
    const totalOffset = hours * 60 + minutes;
    return isNegative ? -totalOffset : totalOffset;
  }

  // Calculate the time difference based on the offset
  const offsetInMinutes = calculateMinuteOffset(offsetPart, isNegativeOffset);

  // Get current UTC DateTime object
  let utcDateTime = DateTime.utc();

  // Add/subtract the calculated offset in minutes to get the local time
  let localDateTime = utcDateTime.plus({ minutes: offsetInMinutes });

  // Return the adjusted local time as a JavaScript Date object
  return new Date(localDateTime.toJSDate());
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
          ? 7
          : getCurrentDateTimeISOWithOffset(
              workout[1] ??
                workout[2] ??
                workout[3] ??
                workout[4] ??
                workout[5] ??
                workout[6] ??
                workout[7]
            ).getDay();
      const workoutTime = workout[dayToGet]
        ? calculateDateTimeFromOffset(workout[dayToGet])
        : null;

      if (workoutTime) {
        const reminderTime = subMinutes(workoutTime, 30);
        const reminderTime1 = subMinutes(workoutTime, 25);

        return {
          ...workout,
          workoutTime,
          reminderTime,
          reminderTime1,
          time: workout[dayToGet],
        };
      } else {
        return null;
      }
    })
    .filter((item) => item !== null);
}

async function sendWhatsAppReminder(phoneNumber, workoutTime, name) {
  try {
    await sendMessage({
      templateName: "g",
      phoneNumber,
      parameters: [
        { type: "text", text: name },
        {
          type: "text",
          text: "(Please set the workouts by going into workout details settings)",
        },
      ],
    });
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

function getCurrentTimeInGMT() {
  // Get the current date in UTC
  const now = new Date();

  // Set seconds and milliseconds to zero
  now.setUTCSeconds(0);
  now.setUTCMilliseconds(0);

  // Return the updated date and time in ISO format (UTC/GMT is the default timezone)
  return now.toISOString();
}

function convertToUTCWithOffset(dateString, timeStringWithOffset) {
  // Example inputs:
  // dateString: "2024-09-28T04:58:00.147Z"
  // timeStringWithOffset: "05:00:00-07" or "20:22:00+05:30"

  // Extract the time part and offset part from the timeStringWithOffset
  const [timePart, offsetPart] = timeStringWithOffset.includes("+")
    ? timeStringWithOffset.split("+")
    : timeStringWithOffset.split("-");

  const isNegativeOffset = timeStringWithOffset.includes("-");

  function calculateMinuteOffset(offsetString, isNegative) {
    const parts = offsetString.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1] || "00", 10);

    // Calculate total offset in minutes (handle negative if needed)
    const totalOffset = hours * 60 + minutes;
    return isNegative ? -totalOffset : totalOffset;
  }

  // Calculate the time difference based on the offset
  const offsetInMinutes = calculateMinuteOffset(offsetPart, isNegativeOffset);

  // Parse the given dateString to a Date object
  const date = new Date(dateString);

  // Adjust the time by the offset (subtracting the offset from the current UTC time)
  date.setUTCMinutes(date.getUTCMinutes() - offsetInMinutes);
  date.setMilliseconds(0);
  // Return the updated date in UTC
  return date.toISOString();
}

export const GET = async (req: any, res: NextApiResponse) => {
  const workouts = await getTodayWorkouts();
  workouts.forEach((workout, index) => {
    const { reminderTime, workoutTime, user_id, reminderTime1, time } = workout;
    const currentTimeUTC = getCurrentTimeInGMT();
    const reminderTimeUTC = convertToUTCWithOffset(reminderTime, time);

    const {
      full_name: name,
      whatsapp_number: phoneNumber,
      telegram_chat_id: chat_id,
    } = user_id;
  
    if (currentTimeUTC == reminderTimeUTC) {
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
