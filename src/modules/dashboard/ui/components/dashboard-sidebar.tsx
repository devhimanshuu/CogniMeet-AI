"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BotIcon,
  StarIcon,
  VideoIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { DashboardTrial } from "./dashboard-trial";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
  {
    icon: LayoutDashboardIcon,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agents",
  },
  {
    icon: SearchIcon,
    label: "AI Search",
    href: "/search",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/upgrade",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="text-sidebar-accent-foreground p-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 opacity-60 blur-sm group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-sidebar rounded-full p-1.5">
              <Image src="/logo.svg" height={28} width={28} alt="CogniMeet.AI" />
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-lg font-bold gradient-text tracking-tight">CogniMeet.AI</p>
            <p className="text-[10px] text-muted-foreground -mt-0.5 tracking-widest uppercase">AI Meeting Intelligence</p>
          </div>
        </Link>
      </SidebarHeader>

      {/* AI Status Indicator */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">AI Services Active</span>
          <SparklesIcon className="size-3 text-emerald-400 ml-auto" />
        </div>
      </div>

      <div className="px-4">
        <Separator className="opacity-[0.06]" />
      </div>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10 rounded-lg transition-all duration-200 border border-transparent",
                        "hover:bg-sidebar-accent hover:border-emerald-500/10",
                        isActive && "bg-sidebar-accent border-emerald-500/15 shadow-sm shadow-emerald-500/5"
                      )}
                      isActive={isActive}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className={cn(
                          "size-[18px] transition-colors",
                          isActive ? "text-emerald-400" : "text-muted-foreground"
                        )} />
                        <span className={cn(
                          "text-sm font-medium tracking-tight transition-colors",
                          isActive ? "text-white" : "text-sidebar-foreground"
                        )}>
                          {item.label}
                        </span>
                        {isActive && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-1">
          <Separator className="opacity-[0.06]" />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 rounded-lg transition-all duration-200 border border-transparent",
                      "hover:bg-sidebar-accent hover:border-amber-500/10",
                      pathname === item.href && "bg-sidebar-accent border-amber-500/15"
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={cn(
                        "size-[18px]",
                        pathname === item.href ? "text-amber-400" : "text-muted-foreground"
                      )} />
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="text-white p-3">
        <DashboardTrial />
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  )
};