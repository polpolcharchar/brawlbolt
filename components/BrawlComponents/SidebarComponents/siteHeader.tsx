"use client"

import { Grip } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { PlayerSelector } from "../Selectors/PlayerSelector"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const router = useRouter()

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b relative">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4 bg-(--primary)">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <Grip />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <PlayerSelector/>
      </div>

      {/* Clickable Header Text */}
      <button
        onClick={() => router.push("/")}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-semibold cursor-pointer select-none"
      >
        BrawlBolt
      </button>
    </header>
  )
}
