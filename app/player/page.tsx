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
    router.push(`/player/${activePlayerTag.replace("#", "")}`)
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 space-y-10">
      <div className="max-w-4xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">BrawlBolt Account Tracking</h1>
        <p className="text-lg text-gray-600">
          Lightning-Accurate Statistics
        </p>
      </div>

      <div className="grid gap-8 max-w-xl w-full md:grid-cols-1">
        {/* Player Stats Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>View Your Account</CardTitle>
            <CardDescription>Enter a Brawl Stars Player Tag to view detailed statistics.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">

            <PlayerSelector />
            <Button onClick={() => handleRedirect("player")} disabled={!activePlayerTag} className="text-gray-200">
              GO!
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}