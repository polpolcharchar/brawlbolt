"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { AlignJustify, ArrowUpLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { PlayerSelector } from "../Selectors/PlayerSelector"

export function SiteHeader({ sidebarOpen }: { sidebarOpen: boolean }) {
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
          {sidebarOpen ? <ArrowUpLeft /> : <AlignJustify />}
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <PlayerSelector />
      </div>

      {/* Clickable Header Text */}
      <button
        onClick={() => router.push("/")}
        className="
    absolute 
    top-1/2 
    right-4          /* align right with some spacing on small screens */
    sm:left-1/2      /* center horizontally on sm+ */
    sm:right-auto    /* unset right on sm+ */
    -translate-y-1/2 
    sm:-translate-x-1/2
    text-3xl 
    font-semibold 
    cursor-pointer 
    select-none
  "
      >
        BrawlBolt
      </button>

    </header>
  )
}
