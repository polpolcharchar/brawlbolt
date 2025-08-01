"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarProvider
} from "@/components/ui/sidebar"
import {
  Bot,
  Github,
  Mail,
  User
} from "lucide-react"
import * as React from "react"
import { useState } from "react"
import { NavMain } from "./navMain"
import { NavSecondary } from "./navSecondary"
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
      url: "/globalBrawlerTable",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Brawler Table",
          url: "/globalBrawlerTable",
        },
        {
          title: "BoltGraph",
          url: "/globalBoltGraph",
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
    {
      title: "contact@brawlbolt.com",
      url: "mailto:contact@brawlbolt.com",
      icon: Mail
    }
  ],
}

export function BrawlSidebar({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarItemClick = (item: any) => {
    if(item.title == "contact@brawlbolt.com"){
      return;
    }else{
      setSidebarOpen(false);
    }
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
                  <p className="text-xs text-(--muted-foreground)">
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
