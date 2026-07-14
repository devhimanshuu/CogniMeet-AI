import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { SearchView } from "@/modules/search/ui/views/search-view";

export default async function SearchPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <SearchView />;
}
