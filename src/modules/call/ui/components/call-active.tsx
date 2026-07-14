"use client";

import Link from "next/link";
import Image from "next/image";
import { BotIcon } from "lucide-react";
import {
  CallControls,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

interface Props {
  onLeave: () => void;
  meetingName: string;
};

const AgentStatusBadge = () => {
  const { useCallCustomData } = useCallStateHooks();
  const custom = useCallCustomData();

  const status = custom?.agentStatus as "joined" | "unavailable" | undefined;
  const agentName = (custom?.agentName as string | undefined) ?? "AI agent";

  if (!status) return null;

  return status === "joined" ? (
    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
      <BotIcon className="size-3.5" />
      {agentName} in call
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
      <BotIcon className="size-3.5" />
      AI agent unavailable
    </span>
  );
};

export const CallActive = ({ onLeave, meetingName }: Props) => {
  return (
    <div className="flex flex-col justify-between p-4 h-full text-white gradient-bg-mesh">
      {/* Header Bar */}
      <div className="glass-card rounded-full px-5 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center justify-center p-1.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <Image src="/logo.svg" width={20} height={20} alt="Logo" />
        </Link>
        <div className="h-4 w-px bg-white/10" />
        <h4 className="text-sm font-medium capitalize">
          {meetingName}
        </h4>
        <div className="ml-auto flex items-center gap-2">
          <AgentStatusBadge />
        </div>
      </div>
      
      {/* Video Layout */}
      <SpeakerLayout />
      
      {/* Controls Bar */}
      <div className="glass-card rounded-full px-4">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};
