// src/WorkoutReminder.js
import React, { useState } from "react";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import dayjs from "dayjs";
import { CircleXIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
        onClick={() => {
          toast.success(
            "Awesome we have saved your workout routine , you will be reminded every single day an hour before your workout on whatsapp !",
            {
              duration: 6000,
            }
          );
          setTimeout(() => {
            push("/");
          }, 6000);
        }}
        className="mt-2 w-full font-medium"
        size="lg"
        color="primary"
      >
        Submit
      </Button>
    </div>
  );
};
