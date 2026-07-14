import { GuestJoinView } from "@/modules/call/ui/views/guest-join-view";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { meetingId } = await params;

  return <GuestJoinView meetingId={meetingId} />;
};

export default Page;
