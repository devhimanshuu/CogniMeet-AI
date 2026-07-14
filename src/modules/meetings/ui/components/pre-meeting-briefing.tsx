"use client";

import { useQuery } from "@tanstack/react-query";
import { SparklesIcon, CalendarClockIcon, AlertCircleIcon, CheckIcon } from "lucide-react";
import { MeetingStatus } from "@/modules/meetings/types";
import { parseActionItems } from "@/modules/meetings/utils";
import { useTRPC } from "@/trpc/client";

interface Props {
  agent: {
    id: string;
    name: string;
    userId: string;
    instructions: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const PreMeetingBriefing = ({ agent }: Props) => {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.meetings.getMany.queryOptions({ 
      agentId: agent.id, 
      status: MeetingStatus.Completed, 
      pageSize: 1 
    })
  );

  const lastMeeting = data?.items?.[0];
  const previousActionItems = parseActionItems(lastMeeting?.actionItems);
  const openActionItems = previousActionItems.filter((item) => !item.done);

  return (
    <div className="glass-card overflow-hidden glow-border relative mt-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="p-6 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <SparklesIcon className="size-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">AI Pre-Meeting Briefing</h3>
            <p className="text-sm text-muted-foreground">Prepared by {agent.name}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground animate-pulse">Loading briefing...</div>
        ) : !lastMeeting ? (
          <div className="text-sm text-muted-foreground">
            No previous completed meetings found with {agent.name}. This space will show context from your past discussions once you complete a meeting.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
                <CalendarClockIcon className="size-4" />
                Recent Context
              </h4>
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  In your last meeting &quot;{lastMeeting.name}&quot;, {lastMeeting.summary ? lastMeeting.summary.substring(0, 300) + "..." : "No summary available."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-amber-400">
                <AlertCircleIcon className="size-4" />
                {openActionItems.length > 0 ? "Open Action Items" : "Previous Action Items"}
              </h4>
              {previousActionItems.length === 0 ? (
                <p className="text-sm text-muted-foreground p-3 rounded-lg border border-border/50 bg-secondary/30">
                  No action items were extracted from your last meeting.
                </p>
              ) : (
                <ul className="space-y-3">
                  {previousActionItems.slice(0, 5).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-secondary/30">
                      <div className={`mt-0.5 size-4 rounded-sm border flex items-center justify-center ${item.done ? "border-emerald-500/50 bg-emerald-500/10" : "border-amber-500/50 bg-amber-500/10"}`}>
                        {item.done && <CheckIcon className="size-3 text-emerald-400" />}
                      </div>
                      <span className={`text-sm text-muted-foreground ${item.done ? "line-through opacity-60" : ""}`}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                  {previousActionItems.length > 5 && (
                    <li className="text-xs text-muted-foreground pl-1">
                      +{previousActionItems.length - 5} more in the last meeting&apos;s Insights tab
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border/30 bg-secondary/10 p-4 px-6 flex justify-between items-center relative z-10">
        <p className="text-xs text-muted-foreground">
          This briefing is generated based on your past meeting history with this agent.
        </p>
      </div>
    </div>
  );
};
