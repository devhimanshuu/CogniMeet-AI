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
      <CallView meetingId={meetingId} />
    </HydrationBoundary>
  );
};

export default Page;
