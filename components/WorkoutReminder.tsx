// src/WorkoutReminder.js
// @ts-nocheck
import React, { useState } from "react";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import dayjs from "dayjs";
import { CircleXIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useAuth } from "@/utils/hooks/useSupabase";
import axios from "axios";
import { parse, format, addMinutes } from "date-fns";
import { DateTime } from "luxon";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const WorkoutReminder = () => {
  const [times, setTimes] = useState<any>(Array(7).fill(""));
  const { push } = useRouter();
  const { supabaseUser } = useAuth();
  const supabase = useSupabaseClient();

  function convertTo12HourFormat(time: string) {
    // Split the time string into hours and minutes
    let [hours, minutes] = time.split(":").map(Number);

    // Determine the period (AM/PM)
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12; // Convert '0' hours to '12'

    // Return the formatted time string
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  const handleTimeChange = (index: any, event: any) => {
    const newTimes = [...times];
    newTimes[index] = event.target.value;
    setTimes(newTimes);
  };

  return (
    <div className="w-full">
      <p>Leave the days that you don't workout :)</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 py-4 md:grid-cols-3 gap-3">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="p-0">
            <Card className="relative">
              <CardBody className="pb-10">
                <p className="text-2xl">{day}</p>
                <div className="p-2">
                  <div className="flex items-center space-x-2">
                    <input
                      aria-label="Time"
                      value={times[index]}
                      onChange={(e) => {
                        handleTimeChange(index, e);
                      }}
                      className="w-[200px]"
                      type="time"
                    />
                    {Boolean(times[index]) && (
                      <Button
                        onClick={() => {
                          setTimes((d: Array<string>) => {
                            return d.map((item: string, idx: number) =>
                              idx === index ? "" : item
                            );
                          });
                        }}
                        variant="light"
                        size="sm"
                        color="danger"
                      >
                        <CircleXIcon />
                      </Button>
                    )}
                  </div>
                  {Boolean(times[index]) && (
                    <Button
                      className="absolute bottom-2 right-2"
                      variant="flat"
                      onClick={() => {
                        setTimes([
                          times[index],
                          times[index],
                          times[index],
                          times[index],
                          times[index],
                          undefined,
                          undefined,
                        ]);
                      }}
                    >
                      Set same time for mon - fri
                    </Button>
                  )}
                  <br />
                  <p className="mt-2 text-sm">
                    {Boolean(times[index]) &&
                      convertTo12HourFormat(times[index])}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
      <Button
        onClick={
          supabaseUser?.id
            ? async () => {
                toast.success(
                  "Awesome we have saved your workout routine , you will be reminded every single day an hour before your workout on whatsapp !",
                  {
                    duration: 6000,
                  }
                );
                // Get the system timezone
                const timeZone =
                  Intl.DateTimeFormat().resolvedOptions().timeZone;

                // Create a base date to combine with the time
                const baseDate = new Date();

                // Convert each time string to a Date object and then to UTC
                const formattedTimes = times.map((time) => {
                  if (time) {
                    const dateWithTime = parse(time, "HH:mm", baseDate);
                    console.log({ timeZone });
                    const now = DateTime.now().setZone(timeZone);
                    const offset = now.toFormat("ZZ");

                    return `${dateWithTime.getHours()}:${
                      dateWithTime.getMinutes() < 10
                        ? `${0}${dateWithTime.getMinutes()}`
                        : dateWithTime.getMinutes()
                    }:00${offset}`;
                  } else {
                    return null;
                  }
                });
                console.log({ formattedTimes });
                await axios.post("/api/supabase/delete", {
                  table: "workouts",
                  match: {
                    user_id: supabaseUser?.id,
                  },
                });
                await axios.post("/api/supabase/insert", {
                  table: "workouts",
                  body: {
                    user_id: supabaseUser?.id,
                    1: formattedTimes[0],
                    2: formattedTimes[1],
                    3: formattedTimes[2],
                    4: formattedTimes[3],
                    5: formattedTimes[4],
                    6: formattedTimes[5],
                    7: formattedTimes[6],
                  },
                });
                setTimeout(() => {
                  push("/");
                }, 6000);
              }
            : () => {}
        }
        className="mt-2 w-full font-medium"
        size="lg"
        color="primary"
      >
        Submit
      </Button>
    </div>
  );
};
