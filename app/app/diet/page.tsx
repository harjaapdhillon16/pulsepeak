"use client";
import AuthButton from "@/components/AuthButton";
import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Oval } from "react-loader-spinner";
import { Button, CardFooter, Card, Image } from "@nextui-org/react";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../../../components/DietForm"),
  {
    ssr: false,
  }
);

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
     
      <div className="p-3 w-screen mx-auto">
        <div className="max-w-[1024px] mx-auto">
        <Button
        onClick={() => {
          push("/");
        }}
        variant="flat"
        color="primary"
      >
        Back
      </Button>
          <DynamicComponentWithNoSSR />
          {/* <div className="md:flex md:space-x-3 space-y-5 md:space-y-0 items-center">
            <div className="w-[400px]">
              <Card isFooterBlurred radius="lg" className="border-none">
                <Image
                  alt="Woman listing to music"
                  className="object-cover"
                  height={300}
                  src="https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzfHx8ZW58MHx8fHx8"
                  width={400}
                />
                <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                  <p className="text-sm text-white text-center font-bold">
                    Create your own diet and set reminders
                  </p>
                </CardFooter>
              </Card>
            </div>
            <div className="w-[400px]">
              <Card isFooterBlurred radius="lg" className="border-none">
                <Image
                  alt="Woman listing to music"
                  className="object-cover"
                  height={300}
                  src="https://images.unsplash.com/photo-1587015566802-5dc157c901cf?q=80&w=2786&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={400}
                />
                <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                  <p className="text-sm text-white text-center font-bold">
                    Use AI to generate your own diet
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Reminder;
