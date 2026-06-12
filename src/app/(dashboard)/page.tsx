import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { DashboardView } from "@/modules/dashboard/ui/views/dashboard-view";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <DashboardView />;
}
