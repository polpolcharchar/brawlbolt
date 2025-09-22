"use client";

import { BrawlerOverTimeChart } from "@/components/BrawlComponents/Charts/BrawlerOverTimeChart";
import { rankedModeLabelMap } from "@/lib/BrawlUtility/BrawlConstants";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPage() {
  const searchParams = useSearchParams();

  const [mode, setMode] = useState("");
  const [matchType, setMatchType] = useState("ranked");

  const [brawler, setBrawler] = useState<string>("");

  useEffect(() => {
    const brawlerParam = searchParams.get("brawler");
    if (brawlerParam) {
      setBrawler(brawlerParam.toUpperCase());
    }else{
      setBrawler("SHELLY");
    }
  }, [searchParams]);

  const updateMatchType = (newValue: string) => {
    if (newValue !== "regular" && rankedModeLabelMap[mode as keyof typeof rankedModeLabelMap] === undefined) {
      setMode("");
    }
    setMatchType(newValue);
  };

  return (
    <div className="border-none m-4">
      <BrawlerOverTimeChart
        mode={mode}
        setMode={setMode}
        matchType={matchType}
        setMatchType={updateMatchType}
        brawler={brawler}
        setBrawler={setBrawler}
        isActive={true}
      />
    </div>
  );
}
