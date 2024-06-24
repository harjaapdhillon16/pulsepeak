"use client";
import AuthButton from "../../components/AuthButton";
import Hero from "@/components/Hero";
import { AuthUserUI } from "@/components/AuthUserUI";
import { useAuth } from "@/utils/hooks/useSupabase";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { BottomTab } from "@/components/bottomTabs";
import { AIPrompt } from "@/components/prompt";

export default function Index() {
  const { ...rest } = useAuth();
  console.log(rest);
  return (
    <div className="flex-1 w-screen flex flex-col gap-5 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-24">
        <div className="w-full max-w-[1024px] flex justify-between items-center p-3 text-sm">
          <img
            className="h-16 w-16"
            src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
          />
          <AuthButton />
        </div>
      </nav>
      <AIPrompt />
      <BottomTab />
    </div>
  );
}
