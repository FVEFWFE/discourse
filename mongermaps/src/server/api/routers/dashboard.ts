import { z } from "zod";
import { createTRPCRouter, subscribedProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  getDashboardData: subscribedProcedure
    .query(async ({ ctx }) => {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
      const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

      // Get latest reports
      const latestReports = await ctx.db.report.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          venue: {
            select: {
              name: true,
              district: true,
              type: true,
            },
          },
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      // Calculate Pattaya Vibe Shift
      const recentReports = await ctx.db.report.findMany({
        where: {
          createdAt: {
            gte: twentyFourHoursAgo,
          },
        },
        select: {
          gfeScore: true,
        },
      });

      const previousReports = await ctx.db.report.findMany({
        where: {
          createdAt: {
            gte: fortyEightHoursAgo,
            lt: twentyFourHoursAgo,
          },
        },
        select: {
          gfeScore: true,
        },
      });

      const currentAvg = recentReports.length > 0
        ? recentReports.reduce((sum, r) => sum + r.gfeScore, 0) / recentReports.length
        : 0;

      const previousAvg = previousReports.length > 0
        ? previousReports.reduce((sum, r) => sum + r.gfeScore, 0) / previousReports.length
        : 0;

      const vibeShift = currentAvg - previousAvg;

      // Calculate Fair Price for Soi 6 ST
      const soi6Reports = await ctx.db.report.findMany({
        where: {
          venue: {
            district: "Soi 6",
          },
          priceST: {
            not: null,
          },
          createdAt: {
            gte: twentyFourHoursAgo,
          },
        },
        select: {
          priceST: true,
        },
      });

      const fairPrice = soi6Reports.length > 0
        ? Math.round(soi6Reports.reduce((sum, r) => sum + (r.priceST || 0), 0) / soi6Reports.length)
        : 1500; // Default if no recent data

      // Count new reports
      const newReportsCount = await ctx.db.report.count({
        where: {
          createdAt: {
            gte: sixHoursAgo,
          },
        },
      });

      // For now, return 0 scam alerts (we'll implement this later)
      const activeScamAlerts = 0;

      return {
        kpis: {
          vibeShift: {
            value: vibeShift,
            trend: vibeShift > 0 ? 'up' : vibeShift < 0 ? 'down' : 'neutral',
            currentAvg,
          },
          fairPrice: {
            value: fairPrice,
            currency: 'THB',
            location: 'Soi 6 ST',
          },
          newReports: {
            value: newReportsCount,
            timeframe: '6 hours',
          },
          scamAlerts: {
            value: activeScamAlerts,
            status: activeScamAlerts > 0 ? 'active' : 'clear',
          },
        },
        latestReports: latestReports.map(report => ({
          id: report.id,
          venueId: report.venueId,
          venueName: report.venue.name,
          district: report.venue.district,
          venueType: report.venue.type,
          playerScore: report.gfeScore,
          serviceQuality: report.serviceQuality,
          pricePaid: report.priceST || report.priceLT || 0,
          serviceType: report.priceST ? 'ST' : 'LT',
          reportedBy: report.user.username,
          reportedAt: report.createdAt,
          tags: [
            ...(report.bbfsOffered ? ['BBFS'] : []),
            ...(report.starfishRating && report.starfishRating <= 3 ? ['Starfish'] : []),
            ...(report.gfeScore >= 8 ? ['GFE'] : []),
          ],
        })),
      };
    }),
});