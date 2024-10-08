"use client";
import AuthButton from "@/components/AuthButton";
import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const Reminder = () => {
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
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
    <>
      <nav className="w-full flex justify-center h-24">
        <div className="w-full max-w-[1024px] flex justify-between items-center p-3 text-sm">
          <img
            className="h-16 w-16"
            src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
          />
          <AuthButton />
        </div>
      </nav>
      <div className="p-3 max-w-[1024px] w-full mx-auto">
        <p className="text-2xl font-medium">
          Fill in your workouts and we will keep reminding you to be on top of
          your goals ⚡ 🔌
        </p>
        <p></p>
      </div>
    </>
  );
};

export default Reminder;
