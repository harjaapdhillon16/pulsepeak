import { useAuth } from "@/utils/hooks/useSupabase";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import axios from "axios";

export const UserMenu = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const { supabaseUser } = useAuth();
  const [linkToSub, setLinkToSub] = useState("");

  useEffect(() => {
    (async () => {
      if (supabaseUser?.id && !isSubscribed) {
        const { data } = await axios.post(
          "/api/razorpay/create-subscription-link",
          {
            user_id: supabaseUser?.id,
            email: supabaseUser?.email,
          }
        );
        setLinkToSub(data);
      }
    })();
  }, [supabaseUser, isSubscribed]);
  return (
    <div className="w-full px-4 min-h-[70vh]">
      <p className="text-2xl">Hey {supabaseUser?.full_name}</p>
      <p className="text-sm mb-5">What do you wanna do today !</p>
      {!isSubscribed && (
        <Card className="max-w-md">
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  Pulsepeak AI
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  @pulsepeak ai
                </h5>
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-default-400">
            <p className="text-xl font-medium text-white">
              Hey there , I can see you're not subscribed to pulsepeak , it's
              only INR 29/ Month to gain access to all the amazing features !
            </p>
          </CardBody>
          <CardFooter className="gap-3">
            <a
              target="_blank"
              href={linkToSub}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              rel="noopener"
            >
              Subscribe for just INR 29/ Month
            </a>
          </CardFooter>
        </Card>
      )}
      <div
        className={`grid lg:grid-cols-2 mt-2 gap-4 grid-cols-1 ${
          isSubscribed ? "" : "opacity-45"
        }`}
      >
        <Link
          href={!isSubscribed ? "/" : "/app/reminder"}
          className="w-full text-left"
        >
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
        <Link
          href={!isSubscribed ? "/" : "/app/workout"}
          className="relative w-full text-left"
        >
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
        <Link
          href={!isSubscribed ? "/" : "/app/diet"}
          className="relative w-full text-left"
        >
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
        <Link
          href={!isSubscribed ? "/" : "/app/leaderboard"}
          className="relative w-full text-left"
        >
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
