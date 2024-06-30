"use client";
import AuthButton from "../components/AuthButton";
import Hero from "@/components/Hero";
import { AuthUserUI } from "@/components/AuthUserUI";
import { useAuth } from "@/utils/hooks/useSupabase";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { BottomTab } from "@/components/bottomTabs";
import Link from "next/link";

export default function Index() {
  const { email } = useAuth();
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
          <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
              <span className="text-sm text-gray-500 sm:text-center mr-4 dark:text-gray-400">
                © 2024{" "}
                <a href="https://flowbite.com/" className="hover:underline">
                  Pulsepeak
                </a>
              </span>
              <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                <li>
                  <Link href="/terms-of-service" className="hover:underline me-4 md:me-6">
                    Terms Of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:underline me-4 md:me-6">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
