"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckIcon, LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  meetingId: string;
}

export const CopyInviteButton = ({ meetingId }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/join/${meetingId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Invite link copied — guests can join without an account");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full lg:w-auto"
      onClick={handleCopy}
    >
      {copied ? <CheckIcon className="size-4" /> : <LinkIcon className="size-4" />}
      Copy invite link
    </Button>
  );
};
