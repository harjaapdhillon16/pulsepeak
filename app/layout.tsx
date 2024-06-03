"use client";
import "./globals.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { NextUIProvider } from "@nextui-org/react";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

export default function RootLayout({ children, pageProps }: any) {
  const client = createBrowserSupabaseClient();
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <SessionContextProvider
            supabaseClient={client}
            initialSession={pageProps?.session}
          >
            <NextUIProvider>
              <main className="dark">
                {children}
              </main>
            </NextUIProvider>
          </SessionContextProvider>
        </main>
      </body>
    </html>
  );
}
