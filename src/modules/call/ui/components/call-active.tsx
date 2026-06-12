import Link from "next/link";
import Image from "next/image";
import {
  CallControls,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";

interface Props {
  onLeave: () => void;
  meetingName: string;
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
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">AI Active</span>
          </div>
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
