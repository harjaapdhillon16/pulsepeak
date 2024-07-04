"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useAuth } from "./useSupabase";

type hookProps =
  | {
      appId?: number;
    }
  | undefined;

export const useSubscribed = () => {
  const { supabaseUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(
    localStorage.getItem("isSubscribed") ?? false
  );

  useEffect(() => {
    let intervalId: any;
    const fetchData = async () => {
      if (supabaseUser?.id) {
        const {
          data: { data },
        } = await axios.post("/api/supabase/select", {
          table: "subscriptions",
          match: {
            user_id: supabaseUser?.id,
          },
        });
        if (data?.[0]) {
          setIsSubscribed(true);
          localStorage.setItem("isSubscribed", "true");
          clearInterval(intervalId);
        }
        setLoading(false);
      }
    };

    if (supabaseUser?.id) {
      intervalId = setInterval(fetchData, 500);
    } else {
      setLoading(false);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [supabaseUser]);

  return {
    isSubscribed,
    loading,
  };
};
