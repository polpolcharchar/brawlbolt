"use client";

import { columns } from "@/components/BrawlComponents/Tables/BrawlerTable/Columns";
import { GlobalBrawlerTable } from "@/components/BrawlComponents/Tables/BrawlerTable/GlobalBrawlerTable";
import { rankedModeLabelMap } from "@/lib/BrawlUtility/BrawlConstants";
import { updateBrawlerAndModeLabels } from "@/lib/BrawlUtility/BrawlDataFetcher";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GlobalBrawlerTablePage() {
  const router = useRouter();

  const [mode, setMode] = useState("");
  const [matchType, setMatchType] = useState("ranked");

  const updateMatchType = (newValue: string) => {
    if (newValue !== "regular" && rankedModeLabelMap[mode as keyof typeof rankedModeLabelMap] === undefined) {
      setMode("");
    }
    setMatchType(newValue);
  };

  const handleBrawlerClick = (brawlerName: string) => {
    router.push(`/brawlerHistory?brawler=${encodeURIComponent(brawlerName)}`);
  };

  useEffect(() => {
    updateBrawlerAndModeLabels();
  }, []);

  return (
    <GlobalBrawlerTable
      playerTag="global"
      columns={columns}
      onBrawlerClick={handleBrawlerClick}
      mode={mode}
      setMode={setMode}
      matchType={matchType}
      setMatchType={updateMatchType}
    />
  );
}
