"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import {
  BookOpen,
  Bot,
  LifeBuoy,
  Send,
  User
} from "lucide-react"
import * as React from "react"
import { NavMain } from "./navMain"
import { NavSecondary } from "./navSecondary"
import { PlayerSelector } from "../Selectors/PlayerSelector"
import { Command } from "@/components/ui/command"

const data = {
  //   user: {
  //     name: "shadcn",
  //     email: "m@example.com",
  //     avatar: "/avatars/shadcn.jpg",
  //   },
  navMain: [
    {
      title: "Player Data *",
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
      title: "Global Statistics *",
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
    {
      title: "More *",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "About BrawlBolt *",
          url: "/about",
        },
        {
          title: "GitHub *",
          url: "/github",
        },
        {
          title: "More Info *",
          url: "/info",
        }
      ],
    }
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
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
      </SidebarContent>
    </Sidebar>
  )
}
