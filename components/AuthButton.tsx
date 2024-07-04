import { useAuth } from "@/utils/hooks/useSupabase";
import { createClient } from "@/utils/supabase/server";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function AuthButton() {
  const { email, supabaseUser } = useAuth();
  const supabase = useSupabaseClient();
  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    return redirect("/login");
  };

  return email ? (
    <div className="flex items-center gap-4">
      <form action={signOut}>
        <button className="py-2 px-4 bg-blue-600 rounded-md no-underline">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <>
      <Link
        href="/login"
        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-white rounded-lg group bg-blue-500"
      >
        <span className="relative px-5 py-2 transition-all ease-in duration-75 rounded-md ">
          Experience Pulsepeak
        </span>
      </Link>
    </>
  );
}
