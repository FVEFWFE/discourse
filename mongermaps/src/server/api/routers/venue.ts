import { z } from "zod";
import { createTRPCRouter, publicProcedure, subscribedProcedure } from "~/server/api/trpc";

export const venueRouter = createTRPCRouter({
  getVenuesForMap: subscribedProcedure
    .input(z.object({
      city: z.literal("pattaya").default("pattaya"),
    }))
    .query(async ({ ctx, input }) => {
      const venues = await ctx.db.venue.findMany({
        where: {
          // Filter by city when we have multiple cities
        },
        select: {
          id: true,
          name: true,
          type: true,
          latitude: true,
          longitude: true,
          avgGfeScore: true,
          avgPriceST: true,
          district: true,
          _count: {
            select: { reports: true },
          },
        },
      });

      // Calculate avgPlayerScore (using avgGfeScore as the base)
      return venues.map(venue => ({
        ...venue,
        avgPlayerScore: venue.avgGfeScore || 0,
      }));
    }),

  getAll: subscribedProcedure
    .input(z.object({
      city: z.string().default("pattaya"),
      filters: z.object({
        venueType: z.array(z.enum(["GOGO_BAR", "BEER_BAR", "GENTLEMENS_CLUB", "MASSAGE_PARLOR", "HOTEL", "RESTAURANT", "OTHER"])).optional(),
        district: z.string().optional(),
        minGfeScore: z.number().min(1).max(10).optional(),
        maxPrice: z.number().optional(),
        bbfsOnly: z.boolean().optional(),
      }).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {};

      if (input.filters) {
        if (input.filters.venueType && input.filters.venueType.length > 0) {
          where.type = { in: input.filters.venueType };
        }
        if (input.filters.district) {
          where.district = input.filters.district;
        }
        if (input.filters.minGfeScore) {
          where.avgGfeScore = { gte: input.filters.minGfeScore };
        }
        if (input.filters.maxPrice) {
          where.avgPriceST = { lte: input.filters.maxPrice };
        }
      }

      const venues = await ctx.db.venue.findMany({
        where,
        include: {
          _count: {
            select: { reports: true },
          },
        },
      });

      return venues;
    }),

  getById: subscribedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const venue = await ctx.db.venue.findUnique({
        where: { id: input.id },
        include: {
          reports: {
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 50,
          },
          _count: {
            select: { reports: true },
          },
        },
      });

      if (!venue) {
        throw new Error("Venue not found");
      }

      return venue;
    }),

  search: subscribedProcedure
    .input(z.object({
      query: z.string().min(1),
    }))
    .query(async ({ ctx, input }) => {
      const venues = await ctx.db.venue.findMany({
        where: {
          OR: [
            { name: { contains: input.query, mode: "insensitive" } },
            { district: { contains: input.query, mode: "insensitive" } },
          ],
        },
        take: 20,
      });

      return venues;
    }),
});