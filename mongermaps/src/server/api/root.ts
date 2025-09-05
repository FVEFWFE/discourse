import { createTRPCRouter } from "~/server/api/trpc";
import { alphaRouter } from "~/server/api/routers/alpha";
import { authRouter } from "~/server/api/routers/auth";
import { leadRouter } from "~/server/api/routers/lead";
import { venueRouter } from "~/server/api/routers/venue";
import { reportRouter } from "~/server/api/routers/report";
import { subscriptionRouter } from "~/server/api/routers/subscription";
import { referralRouter } from "~/server/api/routers/referral";
import { dashboardRouter } from "~/server/api/routers/dashboard";
import { intelligenceRouter } from "~/server/api/routers/intelligence";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  alpha: alphaRouter,
  auth: authRouter,
  lead: leadRouter,
  venue: venueRouter,
  report: reportRouter,
  subscription: subscriptionRouter,
  referral: referralRouter,
  dashboard: dashboardRouter,
  intelligence: intelligenceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;