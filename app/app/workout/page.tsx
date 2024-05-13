"use client";
import AuthButton from "@/components/AuthButton";
import React, { useState } from "react";
import WorkoutPlanForm from "@/components/WorkoutPlanForm";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Oval } from "react-loader-spinner";

const WorkoutPlanning = () => {
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { goal, frequency, level } = data;
      console.log(data)
    } catch {}
  };
  return (
    <>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-24">
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
          Let's plan you an amazing workouts ⚡ 🔌
        </p>
        <p className="text-xs mt-1 mb-3">
          (Please note you must be going to a gym to follow these workout plans)
        </p>
        {loading ? (
          <>
            <div className="p-3 text-center">
              <p className="animate-pulse">
                Using advanced AI models to build you the best workout plan for
                you{" "}
              </p>
              <div className="mx-auto mt-2 w-[fit-content]">
                <Oval
                  visible={true}
                  height="35"
                  width="35"
                  color="#2547f5"
                  secondaryColor="#ccd4ff"
                  ariaLabel="oval-loading"
                />
              </div>
            </div>
          </>
        ) : (
          <WorkoutPlanForm onSubmit={onSubmit} />
        )}
      </div>
    </>
  );
};

export default WorkoutPlanning;
