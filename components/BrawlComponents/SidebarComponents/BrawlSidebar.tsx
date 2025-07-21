"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu
} from "@/components/ui/sidebar"
import {
  BookOpen,
  Bot,
  Github,
  Info,
  LifeBuoy,
  Send,
  User
} from "lucide-react"
import * as React from "react"
import { NavMain } from "./navMain"
import { NavSecondary } from "./navSecondary"

const data = {
  //   user: {
  //     name: "shadcn",
  //     email: "m@example.com",
  //     avatar: "/avatars/shadcn.jpg",
  //   },
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

export function BrawlSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />

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
  )
}
