"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { BellIcon, SparklesIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const NotificationsBell = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: unreadCount } = useQuery({
    ...trpc.notifications.unreadCount.queryOptions(),
    refetchInterval: 30_000,
  });

  const { data: items } = useQuery({
    ...trpc.notifications.getMany.queryOptions({ limit: 20 }),
    enabled: open,
  });

  const markAllRead = useMutation(
    trpc.notifications.markAllRead.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.notifications.unreadCount.queryOptions());
        queryClient.invalidateQueries(
          trpc.notifications.getMany.queryOptions({ limit: 20 }),
        );
      },
    }),
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen && (unreadCount ?? 0) > 0) {
      markAllRead.mutate();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="size-9 bg-secondary/50 border-border/50 hover:bg-secondary relative"
          aria-label="Notifications"
        >
          <BellIcon className="size-4" />
          {(unreadCount ?? 0) > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b border-border/50">
          <p className="text-sm font-semibold">Notifications</p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {!items || items.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Nothing here yet. You&apos;ll be notified when a meeting summary
              is ready.
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map((notification) => {
                const content = (
                  <div className="flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors">
                    <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 mt-0.5">
                      <SparklesIcon className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {notification.body && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.body}
                        </p>
                      )}
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    )}
                  </div>
                );

                return notification.meetingId ? (
                  <Link
                    key={notification.id}
                    href={`/meetings/${notification.meetingId}`}
                    onClick={() => setOpen(false)}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>{content}</div>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
