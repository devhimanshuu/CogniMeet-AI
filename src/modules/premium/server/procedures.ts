import { eq, count } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { getCustomerStateSafe, getOrCreateCustomer, polarClient } from "@/lib/polar";
import { agents, meetings } from "@/db/schema";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

export const premiumRouter = createTRPCRouter({
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const customer = await getCustomerStateSafe(ctx.auth.user.id);

    const subscription = customer?.activeSubscriptions[0];

    if (!subscription) {
      return null;
    }

    const product = await polarClient.products.get({
      id: subscription.productId,
    });

    return product;
  }),
  getProducts: protectedProcedure.query(async () => {
    const products = await polarClient.products.list({
      isArchived: false,
      isRecurring: true,
      sorting: ["price_amount"],
    });

    return products.result.items;
  }),
  getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
    const customer = await getCustomerStateSafe(ctx.auth.user.id);

    const subscription = customer?.activeSubscriptions[0];

    if (subscription) {
      return null;
    }

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

    return {
      meetingCount: userMeetings.count,
      agentCount: userAgents.count,
    };
  }),
  createCheckout: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const customer = await getOrCreateCustomer({
          externalId: ctx.auth.user.id,
          email: ctx.auth.user.email,
          name: ctx.auth.user.name,
        });
        const checkout = await polarClient.checkouts.create({
          products: [input.productId],
          customerId: customer.id,
          successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
        });
        return checkout.url;
      } catch (error) {
        console.error("[Polar] Checkout creation failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not start checkout. Please try again later.",
        });
      }
    }),
  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const customer = await getOrCreateCustomer({
        externalId: ctx.auth.user.id,
        email: ctx.auth.user.email,
        name: ctx.auth.user.name,
      });
      const session = await polarClient.customerSessions.create({
        customerId: customer.id,
      });
      return session.customerPortalUrl;
    } catch (error) {
      console.error("[Polar] Portal session creation failed:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not open the billing portal. Please try again later.",
      });
    }
  })
});