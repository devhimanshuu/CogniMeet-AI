"use client";

import { LoaderIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { generateAvatarUri } from "@/lib/avatar";

import { CallConnect } from "./call-connect";

interface Props {
  meetingId: string;
  meetingName: string;
};

export const CallProvider = ({ meetingId, meetingName }: Props) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  const name = user.fullName || "User";

  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={user.id}
      userName={name}
      userImage={
        user.imageUrl ??
        generateAvatarUri({ seed: name, variant: "initials" })
      }
    />
  );
};
