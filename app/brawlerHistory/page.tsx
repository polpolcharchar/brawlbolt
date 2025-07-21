"use client";

import { BrawlerOverTimeChart } from "@/components/BrawlComponents/Charts/BrawlerOverTimeChart";
import { Card } from "@/components/ui/card";
import { rankedModeLabelMap, rankedModeLabels } from "@/lib/BrawlUtility/BrawlConstants";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPage() {
  const searchParams = useSearchParams();

  const [mode, setMode] = useState("");
  const [rankedVsRegularToggleValue, setRankedVsRegularToggleValue] = useState("ranked");

  const [brawler, setBrawler] = useState<string>("");

  useEffect(() => {
    const brawlerParam = searchParams.get("brawler");
    if (brawlerParam) {
      setBrawler(brawlerParam.toUpperCase());
    }else{
      setBrawler("SHELLY");
    }
  }, [searchParams]);

  const updateRankedVsRegularToggleValue = (newValue: string) => {
    if (newValue === "ranked" && rankedModeLabelMap[mode as keyof typeof rankedModeLabelMap] === undefined) {
      setMode("");
    }
    setRankedVsRegularToggleValue(newValue);
  };

  return (
    <div className="border-none m-4">
      <BrawlerOverTimeChart
        mode={mode}
        setMode={setMode}
        rankedVsRegularToggleValue={rankedVsRegularToggleValue}
        setRankedVsRegularToggleValue={updateRankedVsRegularToggleValue}
        brawler={brawler}
        setBrawler={setBrawler}
        isActive={true}
      />
    </div>
  );
}
