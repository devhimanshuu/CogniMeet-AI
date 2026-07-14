"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon, VideoIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { GuestCallConnect } from "../components/guest-call-connect";

interface Props {
  meetingId: string;
}

export const GuestJoinView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const [name, setName] = useState("");

  const joinAsGuest = useMutation(
    trpc.meetings.generateGuestToken.mutationOptions(),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0 || joinAsGuest.isPending) return;
    joinAsGuest.mutate({ meetingId, name: trimmed });
  };

  if (joinAsGuest.data) {
    return (
      <GuestCallConnect
        meetingId={meetingId}
        meetingName={joinAsGuest.data.meetingName}
        guestId={joinAsGuest.data.guestId}
        guestName={name.trim()}
        token={joinAsGuest.data.token}
      />
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar p-4">
      <div className="bg-background rounded-2xl border border-border/50 p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/logo.svg" width={32} height={32} alt="CogniMeet.AI" />
          <div>
            <h1 className="text-lg font-semibold">Join meeting as a guest</h1>
            <p className="text-sm text-muted-foreground">
              No account needed — just tell us your name.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={50}
            autoFocus
            className="h-11"
          />
          {joinAsGuest.isError && (
            <p className="text-sm text-destructive">
              {joinAsGuest.error.message === "This meeting is not available to join"
                ? "This meeting has ended or doesn't exist."
                : "Could not join the meeting. Please try again."}
            </p>
          )}
          <Button
            type="submit"
            disabled={name.trim().length === 0 || joinAsGuest.isPending}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            {joinAsGuest.isPending ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <>
                <VideoIcon className="size-4 mr-2" />
                Continue to lobby
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
