import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { BotIcon, LucideHome, LucideNewspaper} from "lucide-react";

export function BottomTab() {
  return (
    <div className="w-full px-10 bottom-2 fixed">
      <Tabs aria-label="Options" color="primary" className="w-full !block bg-black" variant="bordered">
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <BotIcon />
              <span>AI Magic</span>
            </div>
          }
        />
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <LucideHome />
              <span>Home</span>
            </div>
          }
        />
        <Tab
          key="videos"
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
