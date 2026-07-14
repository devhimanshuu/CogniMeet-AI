import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { user } from '@/db/schema';
import { getCustomerStateSafe, polarClient } from '@/lib/polar';
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/modules/premium/constants';
import { initTRPC, TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';
import { cache } from 'react';
export const createTRPCContext = cache(async () => {
  const { userId } = await auth();
  return { userId };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const { userId } = await auth();

  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  let [dbUser] = await db.select().from(user).where(eq(user.id, userId));

  if (!dbUser) {
    try {
      const { clerkClient } = await import('@clerk/nextjs/server');
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      // Placeholder must be unique per user: the email column has a unique
      // constraint, so a shared fallback would break the second user.
      const email = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@users.cognimeet.local`;
      const name = clerkUser.fullName || "User";

      try {
        await polarClient.customers.create({
          email,
          name,
          externalId: userId,
        });
      } catch (error) {
        console.error("Polar customer creation failed or already exists", error);
      }

      [dbUser] = await db.insert(user).values({
        id: userId,
        name,
        email,
        image: clerkUser.imageUrl,
      }).returning();
    } catch (error) {
      console.error("Failed to sync user", error);
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found in DB and sync failed" });
    }
  }

  return next({ ctx: { ...ctx, auth: { user: dbUser } } });
});
export const premiumProcedure = (entity: "meetings" | "agents") =>
  protectedProcedure.use(async ({ ctx, next }) => {
    // null (no Polar customer / Polar unavailable) means free tier - never
    // block a user's core features on billing infrastructure.
    const customer = await getCustomerStateSafe(ctx.auth.user.id);

    const [userMeetings] = await db
      .select({
        count: count(meetings.id),
      })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));

    const [userAgents] = await db
      .select({
        count: count(agents.id),
      })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));

    const isPremium = (customer?.activeSubscriptions.length ?? 0) > 0;
    const isFreeAgentLimitReached = userAgents.count >= MAX_FREE_AGENTS;
    const isFreeMeetingLimitReached = userMeetings.count >= MAX_FREE_MEETINGS;

    const shouldThrowMeetingError =
      entity === "meetings" && isFreeMeetingLimitReached && !isPremium;
    const shouldThrowAgentError =
      entity === "agents" && isFreeAgentLimitReached && !isPremium;

    if (shouldThrowMeetingError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached the maximum number of free meetings",
      });
    }

    if (shouldThrowAgentError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached the maximum number of free agents",
      });
    }

    return next({ ctx: { ...ctx, customer } });
  });
