"use client"

import { BrawlerOverTimeChart } from "@/components/BrawlComponents/Charts/BrawlerOverTimeChart";
import { rankedModeLabelMap, rankedModeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { useState } from "react";

export default function UserPage() {

  const [mode, setMode] = useState("");
  const [rankedVsRegularToggleValue, setRankedVsRegularToggleValue] = useState("ranked");
  const updateRankedVsRegularToggleValue = (newValue: string) => {
    if (newValue == "ranked" && rankedModeLabelMap[mode as keyof typeof rankedModeLabelMap] == undefined) {
      setMode(rankedModeLabels[0]['value']);
    }
    setRankedVsRegularToggleValue(newValue);
  }
  const [brawler, setBrawler] = useState<string>("SHELLY");


  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">
          <p className="text-6xl">Brawler Name</p>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">

        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">

        </div>
      </div>
      <div className="bg-muted/50 flex-1 rounded-xl h-min-content">
        <BrawlerOverTimeChart
          mode={mode}
          setMode={setMode}
          rankedVsRegularToggleValue={rankedVsRegularToggleValue}
          setRankedVsRegularToggleValue={setRankedVsRegularToggleValue}
          brawler={brawler}
          setBrawler={setBrawler}
          isActive={true}
        />
      </div>
    </div>
  );
}