"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./navMain"
import { NavSecondary } from "./navSecondary"
import { NavProjects } from "./navProjects"
import { NavUser } from "./navUser"

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
    //   isActive: true,
      items: [
        {
          title: "Account Page",
          url: "/player",
        },
        {
          title: "BoltGraph",
          url: "/player/boltGraph",
        },
        {
          title: "Match History",
          url: "/player/matchHistory",
        },
      ],
    },
    {
      title: "Global Statistics",
      url: "/global/brawlerChart",
      icon: Bot,
    //   isActive: true,
      items: [
        {
          title: "BoltGraph",
          url: "/global/boltGraph",
        },
        {
          title: "Brawler Chart",
          url: "/global/brawlerChart",
        },
        {
          title: "Brawler History",
          url: "/global/brawlerHistory",
        },
      ],
    },
    {
      title: "More",
      url: "#",
      icon: BookOpen,
    //   isActive: true,
      items: [
        {
          title: "About BrawlBolt",
          url: "/about",
        },
        {
          title: "GitHub",
          url: "/github",
        },
        {
          title: "More Info",
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
//   projects: [
//     {
//       name: "Design Engineering",
//       url: "#",
//       icon: Frame,
//     },
//     {
//       name: "Sales & Marketing",
//       url: "#",
//       icon: PieChart,
//     },
//     {
//       name: "Travel",
//       url: "#",
//       icon: Map,
//     },
//   ],
}

export function BrawlSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      {/* <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
