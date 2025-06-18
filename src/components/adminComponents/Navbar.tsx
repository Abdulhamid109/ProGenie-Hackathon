import { Bandage,  Home, Inbox, LogOut, PersonStanding } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/admin/pages/homepage",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/admin/pages/profilepage",
    icon: PersonStanding,
  },
  {
    title: "alljobs",
    url: "#",
    icon: Bandage,
  },
  
  {
    title: "About Us",
    url: "/admin/pages/aboutus",
    icon: Inbox,
  },
  {
    title: "Logout",
    url: "#",
    icon: LogOut,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-2xl p-4 m-4" >Company Logo</SidebarGroupLabel>
          <hr className="m-2"/>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}