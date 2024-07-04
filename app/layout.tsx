"use client";
import "./globals.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { NextUIProvider } from "@nextui-org/react";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { Toaster, toast } from "sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function RootLayout({ children, pageProps }: any) {
  const client = createBrowserSupabaseClient();
  return (
    <html lang="en" className="dark">
      <body className="">
        <main className="min-h-screen flex flex-col items-center overflow-hidden">
          <SessionContextProvider
            supabaseClient={client}
            initialSession={pageProps?.session}
          >
            <Toaster
              toastOptions={{
                style: {
                  background: "black",
                  color: "white",
                },
                classNames: {
                  error: "text-red-400",
                  success: "text-green-400",
                  warning: "text-yellow-400",
                  info: "text-blue-400",
                },
              }}
            />

            <NextUIProvider>
              <NextThemesProvider attribute="class" defaultTheme="dark">
                <main className="dark text-foreground bg-background">{children}</main>
              </NextThemesProvider>
            </NextUIProvider>
          </SessionContextProvider>
        </main>
      </body>
    </html>
  );
}
