"use client";
import AuthButton from "../components/AuthButton";
import Hero from "@/components/Hero";
import { AuthUserUI } from "@/components/AuthUserUI";
import { useAuth } from "@/utils/hooks/useSupabase";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { BottomTab } from "@/components/bottomTabs";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { useSubscribed } from "@/utils/hooks/useIsSubscribed";

export default function Index() {
  const { email } = useAuth();
  return (
    <div className="flex-1 w-screen flex flex-col gap-5 items-center">
      <nav className="w-full flex justify-center h-24">
        <div className="w-full max-w-[1024px] flex justify-between items-center p-3 text-sm">
          <img
            className="h-16 w-16"
            src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
          />
          <AuthButton />
        </div>
      </nav>
      {Boolean(email) ? (
        <div className="pb-20 max-w-[1024px]">{<AuthUserUI />}</div>
      ) : (
        <div className="animate-in max-w-[1024px] flex-1 flex flex-col gap-20 opacity-0 px-3">
          <Hero />
        </div>
      )}
      {Boolean(email) ? (
        <BottomTab />
      ) : (
        <>
          <Footer />
        </>
      )}
    </div>
  );
}
