import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input, Button, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useAuth } from "@/utils/hooks/useSupabase";
import { toast } from "sonner";
import { DateTime } from "luxon";

function convertTo24Hour(time12h: any) {
  // Extract the time parts
  const time = time12h.match(/(\d+):(\d+) (\w+)/);

  if (time === null) {
    // Invalid format handling
    return null;
  }

  let hours = parseInt(time[1]);
  const minutes = parseInt(time[2]);
  const period = time[3].toUpperCase();

  if (period === "PM" && hours < 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  // Format the result in 24-hour time
  const time24h = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  return time24h;
}

const DietPlanTable = ({ dietPlanArray }: any) => {
  const { control, handleSubmit, register, setValue } = useForm({
    defaultValues: {
      dietPlan: [{ time: "", diet: "" }],
    },
  });

  function convertToUTC(timeString: any, timezone: string) {
    // Create a DateTime object with the provided time and timezone
    let dt = DateTime.fromFormat(timeString, "HH:mm", { zone: timezone });

    // Convert to UTC
    dt = dt.toUTC();

    // Format the UTC time as HH:MM
    let utcTime = dt.toFormat("HH:mm");

    return utcTime;
  }

  const { supabaseUser } = useAuth();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dietPlan",
  });

  useEffect(() => {
    if (dietPlanArray) {
      const allDiets = dietPlanArray.map((item: any) => ({
        time: convertTo24Hour(item.timeToTake) ?? "10:00",
        diet: item.mealDetails,
      }));
      setValue("dietPlan", allDiets);
    }
  }, [dietPlanArray]);

  const onSubmit = async (data: any) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log({ timezone });
    const allTimes = data.dietPlan.map((item: any) =>
      convertToUTC(item.time, timezone)
    );
    const dietArray = data.dietPlan.map((item: any) => item.diet);
    await axios.post("/api/supabase/delete", {
      table: "diets",
      match: {
        user_id: supabaseUser?.id,
      },
    });
    await axios.post("/api/supabase/insert", {
      table: "diets",
      body: {
        actual_meal: dietArray,
        meal_time: allTimes,
        user_id: supabaseUser?.id,
      },
    });
    toast.info("Saved your workouts, will remind you of this everytime :)");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col text-left">
      <div className="grid pt-3 grid-cols-5">
        <div className="px-2 col-span-1">Time</div>
        <div className="px-2 col-span-3">Diet</div>
        <div className="px-2 col-span-1">Action</div>
        <>
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <div className="p-2 col-span-1">
                <Input
                  {...register(`dietPlan.${index}.time`)}
                  type="time"
                  defaultValue={field.time}
                />
              </div>
              <div className="p-2 col-span-3">
                <Textarea
                  {...register(`dietPlan.${index}.diet`)}
                  type="text"
                  defaultValue={field.diet}
                />
              </div>
              <div className="p-2 col-span-1">
                <Button color="danger" onClick={() => remove(index)}>
                  Delete
                </Button>
              </div>
            </React.Fragment>
          ))}
        </>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          color="danger"
          className="mt-4"
          onClick={() => append({ time: "", diet: "" })}
        >
          Add Row
        </Button>
        <Button color="primary" className="mt-4" type="submit">
          Save Diet For Reminder
        </Button>
      </div>
      {/* <Button color="danger" className="mt-4" type="submit">
        Save PDF
      </Button> */}
    </form>
  );
};

export default DietPlanTable;
