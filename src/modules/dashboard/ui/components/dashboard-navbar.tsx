"use client";

import { useEffect, useState } from "react";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { NotificationsBell } from "@/modules/notifications/ui/components/notifications-bell";

import { DashboardCommand } from "./dashboard-command";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.userAgent.toUpperCase().includes("MAC"));
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex px-4 gap-x-2 items-center py-3 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
        <Button 
          className="size-9 bg-secondary/50 border-border/50 hover:bg-secondary hover:border-border transition-all" 
          variant="outline" 
          onClick={toggleSidebar}
        >
          {(state === "collapsed" || isMobile) 
            ?  <PanelLeftIcon className="size-4" /> 
            : <PanelLeftCloseIcon className="size-4" />
          }
        </Button>
        <Button
          className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-foreground bg-secondary/50 border-border/50 hover:bg-secondary hover:border-border transition-all"
          variant="outline"
          size="sm"
          onClick={() => setCommandOpen((open) => !open)}
        >
          <SearchIcon className="size-4" />
          Search
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            {isMac ? <span className="text-xs">&#8984;</span> : <span>Ctrl</span>}K
          </kbd>
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <NotificationsBell />
        </div>
      </nav>
    </>
  );
};
