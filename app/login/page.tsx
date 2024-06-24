"use client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";

export default function Login() {
  const supabase = useSupabaseClient();

  const loginWithGoogle = async (formData: FormData) => {
    console.log({ supabase });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
  };

  return (
    <>
      <img
        className="w-screen h-screen object-cover"
        src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <div className="flex-1 w-screen absolute top-0 left-0 h-screen bg-black bg-opacity-70  flex flex-col px-8 justify-center gap-2">
        <Link
          href="/"
          className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Link>

        <div className="w-[fit-content] text-center mx-auto">
          <p className="font-medium text-3xl mb-2">
            Welcome to the world of extreme fitness !
          </p>
          <button
            onClick={loginWithGoogle as any}
            className="justify-center space-x-2 w-[280px] mx-auto font-medium bg-gray-900 flex items-center rounded-md px-4 py-2 text-foreground mb-2"
          >
            <img
              className="h-4 w-4"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
            />
            <p>Authenticate with Google</p>
          </button>
        </div>
      </div>
    </>
  );
}
