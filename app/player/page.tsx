"use client"

import { PlayerSelector } from "@/components/BrawlComponents/Selectors/PlayerSelector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { isValidTag } from "@/lib/BrawlUtility/BrawlConstants"
import { handlePlayerSearch } from "@/lib/BrawlUtility/BrawlDataFetcher"
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LandingPage() {
  const router = useRouter()

  const { activePlayerTag } = usePlayerData();

  const handleRedirect = async (basePath: string) => {
      router.push(`/${basePath}/${activePlayerTag.replace("#", "")}`)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 space-y-10">
      <div className="max-w-4xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to BrawlBolt</h1>
        <p className="text-lg text-gray-600">
          Lightning-Accurate Statistics
        </p>
      </div>

      <div className="grid gap-8 max-w-4xl w-full md:grid-cols-2">
        {/* Player Stats Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Find Your Account</CardTitle>
            <CardDescription>Enter a Brawl Stars Player Tag to view detailed statistics and recent matches.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">

            <PlayerSelector />
            <Button onClick={() => handleRedirect("boltGraph")} disabled={!activePlayerTag} className="text-gray-200">
              View Player Stats
            </Button>
            <Button onClick={() => handleRedirect("matchHistory")} disabled={!activePlayerTag} className="text-gray-200">
              View Match History
            </Button>

          </CardContent>
        </Card>

        {/* Global Stats Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Explore Global Stats</CardTitle>
            <CardDescription>See rankings, win rates, pick rates, and more across all brawlers and game modes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full mt-4 text-white" onClick={() => router.push("/globalBrawlerChart")}>
              View Global Statistics
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
