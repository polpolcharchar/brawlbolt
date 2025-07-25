"use client"

import { PlayerSelector } from "@/components/BrawlComponents/Selectors/PlayerSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserPage() {

  const router = useRouter()

  const { activePlayerTag } = usePlayerData();

  const handleRedirect = async (basePath: string) => {
    router.push(`/${basePath}/${activePlayerTag.replace("#", "")}`)
  }

  useEffect(() => {
    if(activePlayerTag){
    router.push(`/boltGraph/${activePlayerTag.replace("#", "")}`)
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-12 space-y-10">
      <div className="max-w-4xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">BrawlBolt's BoltGraph</h1>
        <p className="text-lg text-gray-600">
          The most advanced graph for Brawl Stars statistics
        </p>
      </div>

      <div className="grid gap-8 max-w-xl w-full md:grid-cols-1">
        {/* Player Stats Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>View Your Graph</CardTitle>
            <CardDescription>Enter a Brawl Stars Player Tag to view detailed statistics and recent matches.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">

            <PlayerSelector />
            <Button onClick={() => handleRedirect("boltGraph")} disabled={!activePlayerTag} className="text-gray-200">
              GO!
            </Button>

          </CardContent>
        </Card>

        {/* Global Stats Card */}
        {/* <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Explore Global Stats</CardTitle>
            <CardDescription>See rankings, win rates, pick rates, and more across all brawlers and game modes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full mt-4 text-white" onClick={() => router.push("/globalBrawlerChart")}>
              View Global Statistics
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}