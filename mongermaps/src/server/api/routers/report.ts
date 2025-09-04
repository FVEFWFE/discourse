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

  submitManualReport: subscribedProcedure
    .input(z.object({
      text: z.string().min(10).max(10000),
      venueId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: In production, this would pass through an AI service
      // For now, we'll create a basic report with extracted data
      
      // Simple parsing logic (in production, use AI/NLP)
      const textLower = input.text.toLowerCase();
      
      // Extract prices if mentioned
      const priceMatch = textLower.match(/(\d+)\s*(?:thb|baht|฿)/);
      const price = priceMatch ? parseInt(priceMatch[1]) : null;
      const isShortTime = textLower.includes('st') || textLower.includes('short time');
      
      // Extract scores based on keywords
      const gfeScore = textLower.includes('gfe') || textLower.includes('girlfriend') ? 8 : 
                      textLower.includes('mechanical') || textLower.includes('rushed') ? 5 : 7;
      
      const serviceQuality = textLower.includes('excellent') || textLower.includes('amazing') ? 9 :
                            textLower.includes('good') || textLower.includes('nice') ? 7 :
                            textLower.includes('bad') || textLower.includes('terrible') ? 3 : 6;
      
      const bbfsOffered = textLower.includes('bbfs') || textLower.includes('bareback');
      const starfishRating = textLower.includes('starfish') || textLower.includes('lazy') ? 2 : 7;
      
      // Create the report
      const report = await ctx.db.report.create({
        data: {
          userId: ctx.session.user.id,
          venueId: input.venueId,
          gfeScore,
          priceST: isShortTime ? price : null,
          priceLT: !isShortTime ? price : null,
          serviceQuality,
          attractiveness: 7, // Default as we can't extract this
          bbfsOffered,
          starfishRating,
          comment: input.text,
          visitDate: new Date(), // Default to today
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
});