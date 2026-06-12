import { SparklesIcon, CalendarClockIcon, AlertCircleIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentGetOne } from "@/modules/agents/types";

interface Props {
  agent: AgentGetOne;
}

export const PreMeetingBriefing = ({ agent }: Props) => {
  return (
    <div className="glass-card overflow-hidden glow-border relative mt-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <SparklesIcon className="size-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">AI Pre-Meeting Briefing</h3>
            <p className="text-sm text-muted-foreground">Prepared by {agent.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Context */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
              <CalendarClockIcon className="size-4" />
              Recent Context
            </h4>
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                In your last meeting with {agent.name}, you discussed the Q3 product roadmap. The primary focus was on improving the onboarding flow. 
                <br /><br />
                The team decided to deprioritize the dark mode feature in favor of the new dashboard analytics.
              </p>
            </div>
          </div>

          {/* Unresolved Action Items */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-amber-400">
              <AlertCircleIcon className="size-4" />
              Open Items to Address
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-secondary/30">
                <div className="mt-0.5 size-4 rounded-sm border border-amber-500/50 flex items-center justify-center bg-amber-500/10" />
                <span className="text-sm text-muted-foreground">Finalize the onboarding email sequence copy (Assigned to Marketing)</span>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-secondary/30">
                <div className="mt-0.5 size-4 rounded-sm border border-amber-500/50 flex items-center justify-center bg-amber-500/10" />
                <span className="text-sm text-muted-foreground">Review technical feasibility of the new analytics API (Assigned to Engineering)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/30 bg-secondary/10 p-4 px-6 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          This briefing is generated based on your past meeting history with this agent.
        </p>
        <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
          View Past Meetings
          <ArrowRightIcon className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
