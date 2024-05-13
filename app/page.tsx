"use client";
import AuthButton from "../components/AuthButton";
import Hero from "@/components/Hero";
import { AuthUserUI } from "@/components/AuthUserUI";
import { useAuth } from "@/utils/hooks/useSupabase";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Index() {
  const {...rest} = useAuth()
  console.log(rest)
  return (
    <div className="flex-1 w-full flex flex-col gap-5 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-24">
        <div className="w-full max-w-[1024px] flex justify-between items-center p-3 text-sm">
          <img
            className="h-16 w-16"
            src="https://vswwfumiihhlpfevsxcr.supabase.co/storage/v1/object/public/assets/t-logo.png"
          />
          <AuthButton />
        </div>
      </nav>
      {Boolean(rest.email) ? (
        <>{<AuthUserUI />}</>
      ) : (
        <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
          <Hero />
        </div>
      )}

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Created by{" "}
          <a
            href="https://www.instagram.com/_harjaapdhillon_/"
            target="_blank"
            className="font-bold underline"
            rel="noreferrer"
          >
            Harjaap Dhillon
          </a>
        </p>
      </footer>
    </div>
  );
}
