'use client';
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
    const user_id = await user.auth.getUser()
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
  }, []);

  return {
    supabaseUser,
    email: userData?.email,
    userData,
    fetchUserData,
    loading,
  };
};
