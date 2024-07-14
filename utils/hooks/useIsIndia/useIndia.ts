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
        const response = await axios.get(`https://ipapi.co/json/`);
        const { latitude, longitude } = response.data;
        const point = turf.point([longitude, latitude]);
        const indiaPolygon: any = indiaGeoJSON; // Ensure indiaGeoJSON is a valid GeoJSON object
        const isWithinIndia = turf.booleanPointInPolygon(point, indiaPolygon);

        setIsInIndia(isWithinIndia);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchLocation();
  }, []);

  return { isInIndia, error };
};