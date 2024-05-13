"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { useSupabaseClient } from "@supabase/auth-helpers-react";

type hookProps =
  | {
      appId?: number;
    }
  | undefined;

export const useAuth = () => {
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const user = useSupabaseClient();
  const [userData, setUserData] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    const user_id = await user.auth.getUser();
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
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUserData?.();
    user.auth.onAuthStateChange((event, session: any) => {
      if (global?.window?.localStorage) {
        if (session?.user) {
          localStorage.setItem("email", session?.user?.email as any);
        } else {
          localStorage.removeItem("email");
        }
      }
    });
  }, []);

  return {
    supabaseUser,
    email: userData?.email ?? localStorage.getItem("email"),
    userData,
    fetchUserData,
    loading,
  };
};
