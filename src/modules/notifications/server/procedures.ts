import { z } from "zod";
import { and, count, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { notifications } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const notificationsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(20),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, ctx.auth.user.id))
        .orderBy(desc(notifications.createdAt))
        .limit(input?.limit ?? 20);
    }),
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const [row] = await db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, ctx.auth.user.id),
          eq(notifications.read, false),
        )
      );

    return row.count;
  }),
  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    await db
      .update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.userId, ctx.auth.user.id),
          eq(notifications.read, false),
        )
      );

    return { success: true };
  }),
});
