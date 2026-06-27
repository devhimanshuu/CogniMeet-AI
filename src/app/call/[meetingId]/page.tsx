import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getQueryClient, trpc } from "@/trpc/server";

import { CallView } from "@/modules/call/ui/views/call-view";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { meetingId } = await params;

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }


  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
          <div className="text-white">Loading call...</div>
        </div>
      }>
        <ErrorBoundary fallback={
          <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
            <div className="text-white">Error loading call. Please try again.</div>
          </div>
        }>
          <CallView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
