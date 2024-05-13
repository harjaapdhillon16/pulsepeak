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
    return redirect("/login");
  };
  console.log({supabaseUser})
  return email ? (
    <div className="flex items-center gap-4">
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <>
      <Link
        href="/login"
        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-bl from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
      >
        <span className="relative px-5 py-2 transition-all ease-in duration-75 rounded-md ">
          Experience Pulsepeak
        </span>
      </Link>
    </>
  );
}
