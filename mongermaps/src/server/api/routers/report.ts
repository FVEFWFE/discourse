import { z } from "zod";
import { createTRPCRouter, subscribedProcedure } from "~/server/api/trpc";

export const reportRouter = createTRPCRouter({
  create: subscribedProcedure
    .input(z.object({
      venueId: z.string(),
      gfeScore: z.number().min(1).max(10),
      priceST: z.number().optional(),
      priceLT: z.number().optional(),
      serviceQuality: z.number().min(1).max(10),
      attractiveness: z.number().min(1).max(10),
      bbfsOffered: z.boolean().default(false),
      starfishRating: z.number().min(1).max(10).optional(),
      comment: z.string().max(5000).optional(),
      visitDate: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      const report = await ctx.db.report.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });

      // Update venue averages
      const reports = await ctx.db.report.findMany({
        where: { venueId: input.venueId },
      });

      const avgGfeScore = reports.reduce((sum, r) => sum + r.gfeScore, 0) / reports.length;
      const stPrices = reports.filter(r => r.priceST).map(r => r.priceST!);
      const ltPrices = reports.filter(r => r.priceLT).map(r => r.priceLT!);
      
      await ctx.db.venue.update({
        where: { id: input.venueId },
        data: {
          avgGfeScore,
          avgPriceST: stPrices.length > 0 ? stPrices.reduce((a, b) => a + b, 0) / stPrices.length : undefined,
          avgPriceLT: ltPrices.length > 0 ? ltPrices.reduce((a, b) => a + b, 0) / ltPrices.length : undefined,
        },
      });

      return report;
    }),

  getByUser: subscribedProcedure
    .query(async ({ ctx }) => {
      const reports = await ctx.db.report.findMany({
        where: { userId: ctx.session.user.id },
        include: {
          venue: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return reports;
    }),
});