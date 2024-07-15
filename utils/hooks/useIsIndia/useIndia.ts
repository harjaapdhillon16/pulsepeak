import { useState, useEffect } from "react";
import axios from "axios";
import * as turf from "@turf/turf";
import indiaGeoJSON from "./indiaGeo.json";
import { useAuth } from "../useSupabase";

export const useLocationInIndia = () => {
  const { supabaseUser } = useAuth();
  return {
    isInIndia: supabaseUser?.whatsapp_number?.startsWith("+91"),
    error: null,
  };
};
