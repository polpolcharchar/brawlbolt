"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
  SidebarRail
} from "@/components/ui/sidebar"
import {
  Bot,
  Github,
  User
} from "lucide-react"
import * as React from "react"
import { NavMain } from "./navMain"
import { NavSecondary } from "./navSecondary"
import { useState } from "react"
import { SiteHeader } from "./siteHeader"

const data = {
  navMain: [
    {
      title: "Player Data",
      url: "/player",
      icon: User,
      isActive: true,
      items: [
        {
          title: "BoltGraph",
          url: "/boltGraph",
        },
        {
          title: "Match History",
          url: "/matchHistory",
        },
      ],
    },
    {
      title: "Global Statistics",
      url: "/globalBrawlerChart",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "BoltGraph",
          url: "/globalBoltGraph",
        },
        {
          title: "Brawler Chart",
          url: "/globalBrawlerChart",
        },
        {
          title: "Brawler History",
          url: "/brawlerHistory",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "GitHub",
      url: "/github",
      icon: Github,
    },
  ],
}

export function BrawlSidebar({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarItemClick = () => {
    setSidebarOpen(false);
  }

  return (
    <SidebarProvider
      className="flex flex-col"
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
    >
      <SiteHeader sidebarOpen={sidebarOpen}/>
      <div className="flex flex-1">
        <Sidebar
          className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
        >
          <SidebarContent>
            <NavMain items={data.navMain} onItemClick={handleSidebarItemClick} />
            <NavSecondary items={data.navSecondary} className="mt-auto" onItemClick={handleSidebarItemClick} />

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <p className="text-xs text-gray-500">
                    {"This material is unofficial and is not endorsed by Supercell. For more information see Supercell's Fan Content Policy: "}
                    <a href="https://www.supercell.com/fan-content-policy" target="blank">www.supercell.com/fan-content-policy</a>
                    {"."}
                  </p>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset style={{ backgroundColor: "transparent" }}>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>

  )
}
