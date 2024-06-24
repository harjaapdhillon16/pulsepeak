"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, Tab } from "@nextui-org/react";
import { BotIcon, LucideHome, LucideNewspaper } from "lucide-react";

export function BottomTab() {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState("");
  console.log({ pathname });
  useEffect(() => {
    switch (pathname) {
      case "/ai":
        setSelectedKey("ai");
        break;
      case "/":
        setSelectedKey("home");
        break;
      case "/timeline":
        setSelectedKey("timeline");
        break;
      default:
        setSelectedKey("home");
    }
  }, [pathname]);

  return (
    <div className="w-full bottom-0 fixed">
      <Tabs
        aria-label="Options"
        color="primary"
        className="w-full !block bg-black"
        variant="bordered"
        selectedKey={selectedKey}
        // onSelectionChange={handleTabChange as any}
      >
        <Tab
          key="ai"
          title={
            <div
              onClick={() => {
                router.push("/ai");
              }}
              className="flex w-[32.9vw] items-center justify-center space-x-2"
            >
              <BotIcon />
              <span>AI Magic</span>
            </div>
          }
        />
        <Tab
          key="home"
          title={
            <div
              onClick={() => {
                router.push("/");
              }}
              className="flex  w-[32.9vw] justify-center items-center space-x-2"
            >
              <LucideHome />
              <span>Home</span>
            </div>
          }
        />
        <Tab
          key="timeline"
          title={
            <div className="flex items-center space-x-2">
              <LucideNewspaper />
              <span>Timeline</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
