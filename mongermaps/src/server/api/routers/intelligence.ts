import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { subHours } from "date-fns";

export const intelligenceRouter = createTRPCRouter({
  getDashboardMetrics: publicProcedure
    .input(z.object({ 
      city: z.string().default("pattaya") 
    }))
    .query(async ({ input, ctx }) => {
      const last24Hours = subHours(new Date(), 24);
      const last6Hours = subHours(new Date(), 6);
      
      // Get aggregated metrics
      const [vibeMetrics, reportCount, activeAlerts, priceMetrics] = await Promise.all([
        // Average vibe score (GFE score) in last 24 hours
        ctx.db.report.aggregate({
          where: { 
            venue: { district: { contains: input.city, mode: 'insensitive' } },
            createdAt: { gte: last24Hours }
          },
          _avg: { gfeScore: true }
        }),
        
        // Reports in last 6 hours
        ctx.db.report.count({
          where: {
            venue: { district: { contains: input.city, mode: 'insensitive' } },
            createdAt: { gte: last6Hours }
          }
        }),
        
        // Mock active alerts for now
        Promise.resolve(3),
        
        // Average prices
        ctx.db.report.aggregate({
          where: {
            venue: { district: { contains: input.city, mode: 'insensitive' } },
            createdAt: { gte: last24Hours },
            priceST: { not: null }
          },
          _avg: { priceST: true }
        })
      ]);
      
      // Calculate vibe shift
      const previousVibeMetrics = await ctx.db.report.aggregate({
        where: {
          venue: { district: { contains: input.city, mode: 'insensitive' } },
          createdAt: {
            gte: subHours(new Date(), 48),
            lt: last24Hours
          }
        },
        _avg: { gfeScore: true }
      });
      
      const currentVibe = vibeMetrics._avg.gfeScore || 0;
      const previousVibe = previousVibeMetrics._avg.gfeScore || 0;
      const vibeShift = currentVibe - previousVibe;
      
      // If user is not authenticated or not paid, return limited data
      if (!ctx.session?.user || !ctx.session.user.isPaid) {
        return {
          vibeShift: vibeShift.toFixed(1),
          vibeScore: currentVibe.toFixed(1),
          reportCount,
          activeAlerts,
          fairPrice: priceMetrics._avg.priceST ? Math.round(priceMetrics._avg.priceST) : null,
          venues: null, // Hide specific venues
          details: null, // Hide detailed metrics
          isLimited: true
        };
      }
      
      // Return full data for paid users
      const topVenues = await ctx.db.venue.findMany({
        where: {
          district: { contains: input.city, mode: 'insensitive' },
          avgGfeScore: { not: null }
        },
        orderBy: { avgGfeScore: 'desc' },
        take: 5,
        include: {
          _count: { select: { reports: true } }
        }
      });
      
      return {
        vibeShift: vibeShift.toFixed(1),
        vibeScore: currentVibe.toFixed(1),
        reportCount,
        activeAlerts,
        fairPrice: priceMetrics._avg.priceST ? Math.round(priceMetrics._avg.priceST) : null,
        venues: topVenues,
        isLimited: false
      };
    }),
    
  getLiveIntelFeed: publicProcedure
    .input(z.object({
      city: z.string().default("pattaya"),
      limit: z.number().default(10),
      filter: z.string().optional()
    }))
    .query(async ({ input, ctx }) => {
      const baseQuery = {
        where: {
          venue: { 
            district: { contains: input.city, mode: 'insensitive' as const },
            ...(input.filter && { name: { contains: input.filter, mode: 'insensitive' as const } })
          }
        },
        include: {
          venue: true,
          user: { select: { username: true } }
        },
        orderBy: { createdAt: 'desc' as const },
        take: input.limit
      };
      
      const reports = await ctx.db.report.findMany(baseQuery);
      
      // Transform reports for frontend
      const intelData = reports.map(report => ({
        id: report.id,
        time: getRelativeTime(report.createdAt),
        venue: ctx.session?.user?.isPaid ? report.venue.name : "Hidden",
        district: report.venue.district,
        playerScore: report.gfeScore,
        pricePaid: report.priceST ? `${Math.round(report.priceST)} THB` : "N/A",
        service: report.priceST ? "ST" : report.priceLT ? "LT" : "N/A",
        tags: [
          ...(report.bbfsOffered ? ["BBFS"] : []),
          ...(report.starfishRating && report.starfishRating <= 3 ? ["Starfish"] : []),
          ...(report.gfeScore >= 8 ? ["GFE"] : [])
        ],
        isBlurred: !ctx.session?.user?.isPaid
      }));
      
      return {
        data: intelData,
        hasMore: reports.length === input.limit,
        isLimited: !ctx.session?.user?.isPaid
      };
    }),
    
  getVenues: protectedProcedure
    .input(z.object({
      city: z.string(),
      filters: z.object({
        minVibeScore: z.number().optional(),
        maxPrice: z.number().optional(),
        tags: z.array(z.string()).optional(),
        venueType: z.array(z.string()).optional()
      }).optional()
    }))
    .query(async ({ input, ctx }) => {
      // Check if user has active subscription
      if (!ctx.session.user.isPaid) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This feature requires an active subscription"
        });
      }
      
      const venues = await ctx.db.venue.findMany({
        where: {
          district: { contains: input.city, mode: 'insensitive' },
          ...(input.filters?.minVibeScore && { 
            avgGfeScore: { gte: input.filters.minVibeScore } 
          }),
          ...(input.filters?.maxPrice && {
            avgPriceST: { lte: input.filters.maxPrice }
          }),
          ...(input.filters?.venueType && {
            type: { in: input.filters.venueType as any[] }
          })
        },
        include: {
          _count: { select: { reports: true } },
          reports: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              priceST: true,
              priceLT: true,
              createdAt: true
            }
          }
        },
        orderBy: { avgGfeScore: 'desc' }
      });
      
      return venues.map(venue => ({
        id: venue.id,
        name: venue.name,
        type: venue.type,
        district: venue.district,
        vibeScore: venue.avgGfeScore || 0,
        avgPriceST: venue.avgPriceST,
        avgPriceLT: venue.avgPriceLT,
        reportCount: venue._count.reports,
        lastUpdate: venue.reports[0]?.createdAt || venue.createdAt,
        coordinates: {
          lat: venue.latitude,
          lng: venue.longitude
        }
      }));
    }),
    
  getTopVenues: publicProcedure
    .input(z.object({
      city: z.string().default("pattaya"),
      limit: z.number().default(3)
    }))
    .query(async ({ input, ctx }) => {
      const venues = await ctx.db.venue.findMany({
        where: {
          district: { contains: input.city, mode: 'insensitive' },
          avgGfeScore: { not: null }
        },
        orderBy: { avgGfeScore: 'desc' },
        take: input.limit,
        select: {
          id: true,
          name: true,
          avgGfeScore: true
        }
      });
      
      // Hide venue names for non-paid users
      return venues.map(venue => ({
        id: venue.id,
        name: ctx.session?.user?.isPaid ? venue.name : "Premium Venue",
        score: venue.avgGfeScore || 0
      }));
    })
});

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}