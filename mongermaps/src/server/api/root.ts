import { createTRPCRouter } from "~/server/api/trpc";
import { alphaRouter } from "~/server/api/routers/alpha";
import { leadRouter } from "~/server/api/routers/lead";
import { venueRouter } from "~/server/api/routers/venue";
import { reportRouter } from "~/server/api/routers/report";
import { subscriptionRouter } from "~/server/api/routers/subscription";
import { referralRouter } from "~/server/api/routers/referral";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  alpha: alphaRouter,
  lead: leadRouter,
  venue: venueRouter,
  report: reportRouter,
  subscription: subscriptionRouter,
  referral: referralRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;