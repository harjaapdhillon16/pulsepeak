"use client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function Login() {
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const loginWithEmailOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error("Error sending OTP:", error);
    } else {
      setOtpSent(true);
      alert("Check your email for the OTP!");
    }
  };

  const verifyOtp = async (otp: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) {
      console.error("Error verifying OTP:", error);
    } else {
      toast.success("Successfully logged in!");
      window.location.href = "/";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      loginWithEmailOtp(email);
    } else {
      verifyOtp(otp);
    }
  };

  return (
    <>
      <img
        className="w-screen h-screen object-cover"
        src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <div className="flex-1 w-screen absolute top-0 left-0 h-screen bg-black bg-opacity-70 flex flex-col px-8 justify-center gap-2">
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
            Welcome to the world of extreme fitness!
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-2"
          >
            {!otpSent ? (
              <>
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-[280px] mx-auto font-medium bg-gray-900 flex items-center rounded-md text-white px-4 py-2 text-foreground mb-2"
                  required
                />
                <button
                  type="submit"
                  className="justify-center space-x-2 w-[280px] mx-auto font-medium bg-gray-900 flex items-center rounded-md text-white px-4 py-2 text-foreground mb-2"
                >
                  <p>Send OTP</p>
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-[280px] mx-auto font-medium bg-gray-900 flex items-center rounded-md text-white px-4 py-2 text-foreground mb-2"
                  required
                />
                <button
                  type="submit"
                  className="justify-center space-x-2 w-[280px] mx-auto font-medium bg-gray-900 flex items-center rounded-md text-white px-4 py-2 text-foreground mb-2"
                >
                  <p>Verify OTP</p>
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
