
"use client"

import { PlayerSelector } from "@/components/BrawlComponents/Selectors/PlayerSelector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePlayerData } from "@/lib/BrawlUtility/PlayerDataProvider"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  const { activePlayerTag } = usePlayerData();

  const handleRedirect = async (basePath: string) => {
    router.push(`/${basePath}/${activePlayerTag.replace("#", "")}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-12 space-y-10">
      <div className="max-w-4xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-(--foreground)">Welcome to BrawlBolt</h1>
        <p className="text-lg text-(--muted-foreground)">
          Lightning-Accurate Statistics
        </p>
      </div>

      <div className="grid gap-8 max-w-4xl w-full md:grid-cols-2">
        {/* Player Stats Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-(--foreground)">Find Your Account</CardTitle>
            <CardDescription>Enter a Brawl Stars Player Tag to view detailed statistics and recent matches.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">

            <PlayerSelector />
            <Button onClick={() => handleRedirect("player")} disabled={!activePlayerTag} className="text-(--foreground)">
              Account Overview
            </Button>
            <Button onClick={() => handleRedirect("boltGraph")} disabled={!activePlayerTag} className="text-(--foreground)">
              Statistics - BoltGraph
            </Button>
            <Button onClick={() => handleRedirect("matchHistory")} disabled={!activePlayerTag} className="text-(--foreground)">
              Match History
            </Button>

          </CardContent>
        </Card>

        {/* Global Stats Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-(--foreground)">Explore Global Stats</CardTitle>
            <CardDescription>See rankings, win rates, pick rates, and more across all brawlers and game modes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full mt-4 text-(--foreground)" onClick={() => router.push("/globalBrawlerTable")}>
              View Global Statistics
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-4xl text-center space-y-0 text-(--foreground) px-2">
        <h2 className="text-3xl font-bold mb-4">About BrawlBolt</h2>

        {/* Overview Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Overview</h3>
          <p className="text-(--muted-foreground)">
            BrawlBolt tracks your games and provides personalized detailed statistics using every piece of game data possible.
            The options for personalized data analysis are unrivaled compared to other Brawl Stars tracking sites.
            Search your account to get started for <b>FREE</b>!
          </p>
        </section>

        {/* Tracking Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Tracking</h3>
          <p className="text-(--muted-foreground)">
            Player games are passively tracked and compiled as needed.
            As soon as you begin tracking your account, <u>every single game you play for the next month is saved</u>.
            To ensure your account is continually tracked, <u>access your account's statistics at least once a month</u>.
            Unfortunately, a record of games played before tracking began is inaccessible {"(other than the most recent 25 games)"}.
          </p>
        </section>

        {/* Analysis Section */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Analysis</h3>
          <p className="text-(--muted-foreground)">
            With optimized stat caching, it doesn{"'"}t matter how many games you play—statistics will always be available almost instantly.
            Recursive data analysis allows for extremely detailed results. View the BoltGraph.
          </p>
        </section>

      </Card>
    </div>
  )
}
