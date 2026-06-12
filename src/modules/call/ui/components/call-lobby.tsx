import Link from "next/link";
import { LogInIcon, SparklesIcon } from "lucide-react";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { generateAvatarUri } from "@/lib/avatar";

import "@stream-io/video-react-sdk/dist/css/styles.css";

interface Props {
  onJoin: () => void;
};

const DisabledVideoPreview = () => {
  const { user } = useUser();

  const name = user?.fullName || "User";
  const image = user?.imageUrl || generateAvatarUri({
    seed: name,
    variant: "initials",
  });

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name,
          image,
        } as StreamVideoParticipant
      }
    />
  )
}

const AllowBrowserPermissions = () => {
  return (
    <p className="text-sm text-muted-foreground">
      Please grant your browser a permission to access your camera and
      microphone.
    </p>
  );
};

export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

  return (
    <div className="flex flex-col items-center justify-center h-full gradient-bg-mesh relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/3 rounded-full blur-3xl" />
      </div>

      <div className="py-4 px-8 flex flex-1 items-center justify-center relative z-10">
        <div className="flex flex-col items-center justify-center gap-y-6 glass-card p-10 shadow-2xl shadow-black/20 animate-slide-up">
          <div className="flex flex-col gap-y-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <SparklesIcon className="size-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium uppercase tracking-widest">AI-Powered Meeting</span>
            </div>
            <h6 className="text-xl font-semibold text-foreground">Ready to join?</h6>
            <p className="text-sm text-muted-foreground">Set up your camera and microphone before joining</p>
          </div>
          <div className="rounded-xl overflow-hidden border border-border/30">
            <VideoPreview
              DisabledVideoPreview={
                hasBrowserMediaPermission
                  ? DisabledVideoPreview
                  : AllowBrowserPermissions 
              }
            />
          </div>
          <div className="flex gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>
          <div className="flex gap-x-2 justify-between w-full">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link href="/meetings">
                Cancel
              </Link>
            </Button>
            <Button
              onClick={onJoin}
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 gap-2"
            >
              <LogInIcon className="size-4" />
              Join Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}