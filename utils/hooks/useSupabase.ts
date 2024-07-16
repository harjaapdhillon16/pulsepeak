"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTheme } from "next-themes";

type hookProps =
  | {
      appId?: number;
    }
  | undefined;

export const useAuth = () => {
  const [supabaseUser, setSupabaseUser] = useState<any>(() =>
    global?.window?.localStorage?.getItem("supabaseUser") &&
    global?.window?.localStorage?.getItem("supabaseUser") !== "undefined"
      ? JSON.parse(global?.window?.localStorage?.getItem("supabaseUser") ?? "")
      : {}
  );
  const user = useSupabaseClient();
  const { theme, setTheme } = useTheme();

  const [userData, setUserData] = useState<any>("");
  const [loading, setLoading] = useState(true);
  console.log({ theme });
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    const user_id = await user.auth.getUser();
    console.log({ user_id });
    setUserData(user_id.data.user);
    if (user_id.data.user?.email) {
      const {
        data: { data: dbData },
      } = await axios.post("/api/supabase/select", {
        table: "users",
        match: {
          email: user_id.data.user?.email,
        },
      });
      setSupabaseUser(dbData?.[0]);
      global?.window?.localStorage?.setItem(
        "supabaseUser",
        JSON.stringify(dbData?.[0])
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchUserData?.();
    user.auth.onAuthStateChange((event, session: any) => {
      if (global?.window?.localStorage) {
        if (session?.user) {
          global?.window?.localStorage.setItem(
            "email",
            session?.user?.email as any
          );
        } else {
          global?.window?.localStorage.removeItem("email");
        }
      }
    });
  }, [fetchUserData, user.auth]);

  return {
    supabaseUser,
    email: userData?.email ?? global?.window?.localStorage?.getItem?.("email"),
    userData,
    fetchUserData,
    loading,
  };
};
