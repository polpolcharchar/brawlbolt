"use client"

import { columns } from "@/components/BrawlComponents/Tables/BrawlerTable/Columns";
import { GlobalBrawlerTable } from "@/components/BrawlComponents/Tables/BrawlerTable/GlobalBrawlerTable";
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

  return (
    <GlobalBrawlerTable
      playerTag="global"
      columns={columns}
      onBrawlerClick={() => {}}
      mode={mode}
      setMode={setMode}
      rankedVsRegularToggleValue={rankedVsRegularToggleValue}
      setRankedVsRegularToggleValue={setRankedVsRegularToggleValue}
    />
  );
}