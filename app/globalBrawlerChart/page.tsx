"use client";

import { columns } from "@/components/BrawlComponents/Tables/BrawlerTable/Columns";
import { GlobalBrawlerTable } from "@/components/BrawlComponents/Tables/BrawlerTable/GlobalBrawlerTable";
import { rankedModeLabelMap, rankedModeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserPage() {
  const router = useRouter();

  const [mode, setMode] = useState("");
  const [rankedVsRegularToggleValue, setRankedVsRegularToggleValue] = useState("ranked");

  const updateRankedVsRegularToggleValue = (newValue: string) => {
    if (newValue === "ranked" && rankedModeLabelMap[mode as keyof typeof rankedModeLabelMap] === undefined) {
      setMode("");
    }
    setRankedVsRegularToggleValue(newValue);
  };

  const handleBrawlerClick = (brawlerName: string) => {
    router.push(`/brawlerHistory?brawler=${encodeURIComponent(brawlerName)}`);
  };

  return (
    <GlobalBrawlerTable
      playerTag="global"
      columns={columns}
      onBrawlerClick={handleBrawlerClick}
      mode={mode}
      setMode={setMode}
      rankedVsRegularToggleValue={rankedVsRegularToggleValue}
      setRankedVsRegularToggleValue={updateRankedVsRegularToggleValue}
    />
  );
}
