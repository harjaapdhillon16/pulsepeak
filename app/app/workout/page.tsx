// @ts-nocheck
"use client";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../../../components/WorkoutPageComponent"),
  {
    ssr: false,
  }
);

export default () => <DynamicComponentWithNoSSR />;
