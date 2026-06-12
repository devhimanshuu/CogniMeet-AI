"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3Icon, 
  BotIcon, 
  CalendarCheckIcon, 
  ClockIcon, 
  SparklesIcon, 
  TrendingUpIcon,
  VideoIcon,
  ZapIcon
} from "lucide-react";
import { format } from "date-fns";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneratedAvatar } from "@/components/generated-avatar";

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="glass-card p-6 relative overflow-hidden group hover-lift">
    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full transition-transform group-hover:scale-110 ${color}`} />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 backdrop-blur-sm border border-white/10`}>
        <Icon className="size-5 text-white" />
      </div>
      {trend && (
        <span className="text-xs font-medium text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
          <TrendingUpIcon className="size-3" />
          {trend}
        </span>
      )}
    </div>
    <p className="text-sm text-muted-foreground font-medium mb-1 relative z-10">{title}</p>
    <h4 className="text-3xl font-bold text-foreground tracking-tight relative z-10">{value}</h4>
  </div>
);

export const DashboardView = () => {
  const trpc = useTRPC();
  
  const { data: meetingsData, isLoading: isLoadingMeetings } = useQuery(
    trpc.meetings.getMany.queryOptions({ limit: 5 })
  );
  
  const { data: agentsData, isLoading: isLoadingAgents } = useQuery(
    trpc.agents.getMany.queryOptions()
  );

  const totalMeetings = meetingsData?.pages[0]?.nextCursor 
    ? "5+" 
    : (meetingsData?.pages[0]?.items.length || 0);

  const totalAgents = agentsData?.pages[0]?.items.length || 0;
  
  const recentMeetings = meetingsData?.pages[0]?.items || [];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 gradient-bg-mesh">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="glass-card p-8 relative overflow-hidden glow-border">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <SparklesIcon className="size-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Daily AI Briefing</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Welcome back to CogniMeet.AI</h1>
              <p className="text-muted-foreground max-w-xl leading-relaxed">
                Your AI assistants are ready. You have <span className="text-emerald-400 font-medium">{totalMeetings} meetings</span> analyzed and <span className="text-cyan-400 font-medium">{totalAgents} agents</span> active.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                <Link href="/meetings">
                  <VideoIcon className="size-4 mr-2" />
                  New Meeting
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Meetings" value={isLoadingMeetings ? "-" : totalMeetings} icon={VideoIcon} color="bg-emerald-500" trend="+12%" />
          <StatCard title="Active Agents" value={isLoadingAgents ? "-" : totalAgents} icon={BotIcon} color="bg-cyan-500" />
          <StatCard title="Action Items" value="14" icon={ZapIcon} color="bg-amber-500" />
          <StatCard title="Hours Saved" value="12.5" icon={ClockIcon} color="bg-violet-500" trend="+2.5h" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Meetings */}
          <div className="lg:col-span-2 glass-card flex flex-col h-[400px]">
            <div className="p-6 border-b border-border/30 flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CalendarCheckIcon className="size-5 text-emerald-400" />
                Recent Meetings
              </h3>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/meetings">View All</Link>
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {recentMeetings.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <VideoIcon className="size-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No meetings yet. Start one to see it here!</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {recentMeetings.map((meeting) => (
                      <Link 
                        key={meeting.id} 
                        href={`/meetings/${meeting.id}`}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors group"
                      >
                        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                          <VideoIcon className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{meeting.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{format(new Date(meeting.createdAt), "MMM d, yyyy")}</span>
                            <span>•</span>
                            <span className="capitalize">{meeting.status}</span>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                          <GeneratedAvatar seed={meeting.agent.name} variant="botttsNeutral" className="size-8 border-border" />
                          <span className="text-sm font-medium text-muted-foreground">{meeting.agent.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* AI Insights Panel */}
          <div className="glass-card flex flex-col h-[400px]">
            <div className="p-6 border-b border-border/30">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3Icon className="size-5 text-cyan-400" />
                Productivity Score
              </h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-40 h-40 mb-6">
                <div className="absolute inset-0 rounded-full border-8 border-secondary" />
                <div 
                  className="absolute inset-0 rounded-full border-8 border-cyan-400 border-t-transparent border-r-transparent rotate-45 transition-all duration-1000"
                  style={{ strokeDasharray: "280", strokeDashoffset: "70" }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold gradient-text">85</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Out of 100</span>
                </div>
              </div>
              <h4 className="font-semibold text-lg mb-2">Excellent Meeting Health</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your recent meetings have high decision density and clear action items. Keep it up!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
