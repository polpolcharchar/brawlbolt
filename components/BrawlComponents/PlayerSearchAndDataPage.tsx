"use client"

import { StatisticCard } from "@/components/BrawlComponents/MainCards/StatisticCard";
import { PlayerTagInput } from "@/components/BrawlComponents/PlayerTagInput";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import ScarceDataAlertCard from "./InfoCards/ScarceDataAlertCard";

export const PlayerSearchAndDataPage = () => {

  const {
    playerData,
    updatePlayerData
  } = usePlayerData();

  const searchParams = useSearchParams();
  const tagParameter = searchParams.get('tag');

  //Load Default
  useEffect(() => {
    if(tagParameter){
      updatePlayerData(tagParameter, tagParameter);
    }
  }, [tagParameter]);

  return (
    <div className="flex flex-col items-center">
      <PlayerTagInput />
      {
        Object.entries(playerData)
          .sort(([tagA, dataA], [tagB, dataB]) => {

            //show Loading first
            if(dataA === "Loading..."){
              return -1;
            }else if(dataB === "Loading..."){
              return 1;
            }

            const indexA = (dataA as { sortIndex?: number }).sortIndex;
            const indexB = (dataB as { sortIndex?: number }).sortIndex;

            if (indexA === undefined && indexB === undefined) return 0;
            if (indexA === undefined) return 1;
            if (indexB === undefined) return -1;
            return indexB - indexA;
          })
          .map(([playerTag, playerData]) => {
            return <StatisticCard key={playerTag} playerTag={playerTag} />;
          })
      }

      <ScarceDataAlertCard />


    </div>
  );
}
