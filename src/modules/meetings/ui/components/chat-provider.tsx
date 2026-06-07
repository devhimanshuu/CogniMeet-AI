"use client";

import { useUser } from "@clerk/nextjs";
import { LoadingState } from "@/components/loading-state";

import { ChatUI } from "./chat-ui";

interface Props {
  meetingId: string;
  meetingName: string;
}

export const ChatProvider = ({ meetingId, meetingName }: Props) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return (
      <LoadingState
        title="Loading..."
        description="Please wait while we load the chat"
      />
    );
  }

  return (
    <ChatUI
      meetingId={meetingId}
      meetingName={meetingName}
      userId={user.id}
      userName={user.fullName || "User"}
      userImage={user.imageUrl ?? ""}
    />
  )
};