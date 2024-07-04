"use client";
import AuthButton from "@/components/AuthButton";
import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Oval } from "react-loader-spinner";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { WorkoutReminder } from "@/components/WorkoutReminder";

const Reminder = () => {
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { push } = useRouter();
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { goal, frequency, level } = data;
      console.log(data);
    } catch {}
  };
  return (
    <div className="w-screen">
      <nav className="w-full flex justify-center h-24">
        <div className="w-full flex justify-between items-center p-3 text-sm  max-w-5xl" >
          <img
            className="h-16 w-16"
            src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
          />
          <AuthButton />
        </div>
      </nav>
      <div className="p-3 w-full  max-w-5xl mx-auto">
        <Button
          onClick={() => {
            push("/");
          }}
          variant="flat"
          color="primary"
        >
          Back
        </Button>
        <p className="text-2xl mt-3 font-medium">
          Fill in your workouts and we will keep reminding you to be on top of
          your goals ⚡ 🔌
        </p>
        <WorkoutReminder />
      </div>
    </div>
  );
};

export default Reminder;
