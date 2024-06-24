// @ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../utils/supabase";
import { NextResponse } from "next/server";
import axios from "axios";
const { parseISO, subMinutes, isAfter, isBefore, getDay } = require("date-fns");
const { utcToZonedTime, zonedTimeToUtc } = require("date-fns-tz");

async function getTodayWorkouts() {
  const { data, error } = await supabase.from("workouts").select("*");

  if (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }

  return data.map((workout) => {
    const { timeZone } = workout;
    const now = new Date();
    const localNow = utcToZonedTime(now, timeZone);
    const dayOfWeek = getDay(localNow); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    const workoutTime = parseISO(workout[dayOfWeek.toString()]);
    const workoutLocalTime = utcToZonedTime(workoutTime, timeZone);
    const reminderTime = subMinutes(workoutLocalTime, 30); // 30 minutes before
    return {
      ...workout,
      workoutTime: workoutLocalTime,
      reminderTime,
      timeZone,
    };
  });
}
async function sendWhatsAppReminder(phoneNumber, workoutTime, timeZone) {
  const message = `Reminder: Your workout starts at ${workoutTime}. Get ready!`;

  try {
    await axios.post("https://your-whatsapp-api-endpoint", {
      to: phoneNumber,
      message: message,
    });
    console.log(
      `Reminder sent to ${phoneNumber} for workout at ${workoutTime}`
    );
  } catch (error) {
    console.error("Error sending WhatsApp reminder:", error);
  }
}

export const POST = async (req: any, res: NextApiResponse) => {
  const {} = await req.json();
  const workouts = await getTodayWorkouts();
  const now = new Date();

  workouts.forEach((workout) => {
    const {
      reminderTime,
      workoutTime,
      phone_number: phoneNumber,
      timeZone,
    } = workout;

    const currentLocalTime = utcToZonedTime(now, timeZone);

    if (
      isAfter(currentLocalTime, reminderTime) &&
      isBefore(currentLocalTime, workoutTime)
    ) {
      sendWhatsAppReminder(phoneNumber, workoutTime, timeZone);
    }
  });
  return NextResponse.json({ success: true });
};
