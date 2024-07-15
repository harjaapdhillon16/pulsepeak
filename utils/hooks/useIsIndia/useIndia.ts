import { useState, useEffect } from "react";
import axios from "axios";
import * as turf from "@turf/turf";
import indiaGeoJSON from "./indiaGeo.json";

export const useLocationInIndia = () => {
  const [isInIndia, setIsInIndia] = useState<boolean | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`http://ip-api.com/json/`);
        const { country } = response.data;

        setIsInIndia(country === "India");
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchLocation();
  }, []);

  return { isInIndia, error };
};
