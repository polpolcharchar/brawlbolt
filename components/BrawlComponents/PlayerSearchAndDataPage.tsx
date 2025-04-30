"use client"

import { PlayerCard } from "@/components/BrawlComponents/PlayerCard";
import { PlayerTagInput } from "@/components/BrawlComponents/PlayerTagInput";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export const PlayerSearchAndDataPage = () => {

  const {
    playerData,
    updatePlayerData
  } = usePlayerData();

  const searchParams = useSearchParams();
  const tagParameter = searchParams.get('tag'); // Get the 'playerID' query parameter

  //Load Default
  useEffect(() => {
    const fetchData = async () => {
      if (tagParameter) {
        try {

          updatePlayerData(tagParameter, "Loading...");

          const response = await fetch(
            "https://hfdejn2qu3.execute-api.us-west-1.amazonaws.com/default/BrawlTrackerHandlerPython",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "getPlayerData", "playerTag": tagParameter }),
            }
          );

          if (response.status === 502) {
            console.error("Server error: 502 Bad Gateway");
            updatePlayerData(tagParameter, "Player not found, initiate tracking above");
          } else if (response.status === 200) {
            const body = await response.text();
            updatePlayerData(tagParameter, JSON.parse(body));
          } else {
            console.error(`Unexpected response status: ${response.status}`);
            updatePlayerData(tagParameter, "Player not found, initiate tracking above");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          // Handle network errors or other exceptions
        }
      }
    };

    fetchData();
  }, [tagParameter]); // Add tagParameter to the dependency array


  return (
    <div className="flex flex-col items-center">
      <PlayerTagInput />

      

      {
        Object.entries(playerData).map(([playerTag, playerData]) => {
            return (
              <PlayerCard key={playerTag} playerTag={playerTag} />
            )

        })
      }

    </div>
  );
}
