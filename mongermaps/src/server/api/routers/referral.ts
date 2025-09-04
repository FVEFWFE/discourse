import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const referralRouter = createTRPCRouter({
  getMyReferralLink: protectedProcedure
    .query(async ({ ctx }) => {
      const baseUrl = process.env.NEXTAUTH_URL || "https://mongermaps.io";
      const referralLink = `${baseUrl}?ref=${ctx.session.user.id}`;
      
      return { referralLink };
    }),

  getMyStats: protectedProcedure
    .query(async ({ ctx }) => {
      const referrals = await ctx.db.referral.findMany({
        where: { referrerId: ctx.session.user.id },
        include: {
          referred: {
            include: {
              subscriptions: {
                where: { type: "ANNUAL" },
              },
            },
          },
        },
      });

      const totalClicks = referrals.reduce((sum, r) => sum + r.clickCount, 0);
      const totalSignups = referrals.length;
      const conversions = referrals.filter(r => r.converted).length;

      const commissions = await ctx.db.commission.findMany({
        where: { userId: ctx.session.user.id },
      });

      const totalEarned = commissions.reduce((sum, c) => sum + c.amount, 0);
      const totalPaid = commissions
        .filter(c => c.status === "PAID")
        .reduce((sum, c) => sum + c.amount, 0);
      const pendingAmount = totalEarned - totalPaid;

      return {
        totalClicks,
        totalSignups,
        conversions,
        totalEarned,
        totalPaid,
        pendingAmount,
        referrals: referrals.map(r => ({
          id: r.id,
          username: r.referred.username,
          signupDate: r.createdAt,
          hasAnnualSubscription: r.referred.subscriptions.length > 0,
        })),
      };
    }),

  trackClick: protectedProcedure
    .input(z.object({
      referrerId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Don't track self-referrals
      if (input.referrerId === ctx.session.user.id) {
        return { tracked: false };
      }

      const existingReferral = await ctx.db.referral.findFirst({
        where: {
          referrerId: input.referrerId,
          referredId: ctx.session.user.id,
        },
      });

      if (existingReferral) {
        await ctx.db.referral.update({
          where: { id: existingReferral.id },
          data: { clickCount: { increment: 1 } },
        });
      } else {
        await ctx.db.referral.create({
          data: {
            referrerId: input.referrerId,
            referredId: ctx.session.user.id,
            clickCount: 1,
          },
        });
      }

      return { tracked: true };
    }),
});