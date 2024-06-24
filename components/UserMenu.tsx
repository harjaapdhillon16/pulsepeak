import { useAuth } from "@/utils/hooks/useSupabase";
import React from "react";
import Link from "next/link";

export const UserMenu = () => {
  const { supabaseUser } = useAuth();
  return (
    <div className="w-full px-4 min-h-[70vh]">
      <p className="text-2xl">Hey {supabaseUser?.full_name}</p>
      <p className="text-sm mb-5">What do you wanna do today !</p>
      <div className="grid lg:grid-cols-2 gap-4 grid-cols-1">
        <Link href="/app/reminder" className="w-full text-left">
          <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <div
              className="absolute w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1581646064576-6bc5a216f02c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJlbWluZGVyfGVufDB8MHwwfHx8MA%3D%3D')",
              }}
            ></div>
            <div className="absolute w-full h-full bg-black opacity-50"></div>
            <div className="relative top-36 bottom-3 p-4 text-white">
              <h2 className="text-2xl font-semibold mb-1">
                Workout Reminders and Lift Tracker
              </h2>
              <p className="text-base">
                We'll remind of you of you're workouts and keep you on track 🔥
              </p>
            </div>
          </div>
        </Link>
        <Link href="/app/workout" className="relative w-full text-left">
          <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <div
              className="absolute w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1581009137042-c552e485697a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d29ya291dHxlbnwwfDB8MHx8fDA%3D')",
              }}
            ></div>
            <div className="absolute w-full h-full bg-black opacity-50"></div>
            <div className="relative top-36 bottom-3 p-4 text-white">
              <h2 className="text-2xl font-semibold mb-1">Workout Planning</h2>
              <p className="text-base">
                We'll create a FREE pdf for you , for an ultimate workout
                according to your needs 🔥
              </p>
            </div>
          </div>
        </Link>
        <Link href="/app/diet" className="relative w-full text-left">
          <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <div
              className="absolute w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRpZXR8ZW58MHwwfDB8fHww')",
              }}
            ></div>
            <div className="absolute w-full h-full bg-black opacity-50"></div>
            <div className="relative top-36 bottom-3 p-4 text-white">
              <h2 className="text-2xl font-semibold mb-1">Diet Planning</h2>
              <p className="text-base">
                Let's plan your diet according to your fitness needs, and get
                you healthy !
              </p>
            </div>
          </div>
        </Link>
        <Link href="/app/leaderboard" className="relative w-full text-left">
          <div className=" opacity-65 w-full h-64 rounded-lg overflow-hidden shadow-lg">
            <div
              className="absolute w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1687393629507-a594caa64c1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3ltJTIwY29tbXVuaXR5fGVufDB8fDB8fHww')",
              }}
            ></div>
            <div className="absolute w-full h-full bg-black opacity-50"></div>
            <div className="relative top-36 bottom-3 p-4 text-white">
              <h2 className="text-2xl font-semibold mb-1">
                Fitness Leaderboard
              </h2>
              <p className="text-base">See where you stand among your peers</p>
            </div>
          </div>
          <button className="top-3 absolute left-3 bg-green-600 rounded-full px-5 text-xs py-1">
            Coming Soon
          </button>
        </Link>
      </div>
    </div>
  );
};



