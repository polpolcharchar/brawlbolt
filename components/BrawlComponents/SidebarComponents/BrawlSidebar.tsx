"use client"

import {
  Sidebar,
  SidebarContent
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
          title: "Account Search *",
          url: "/player",
        },
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
