import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const leadRouter = createTRPCRouter({
  capture: publicProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists
      const existing = await ctx.db.lead.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        // Don't reveal that the email already exists for privacy
        return {
          success: true,
          message: "Success! Check your email for the Fair Price Cheat Sheet.",
        };
      }

      // Create lead
      const lead = await ctx.db.lead.create({
        data: {
          email: input.email,
        },
      });

      // TODO: Integrate with email service (Mailchimp/ConvertKit)
      // TODO: Send cheat sheet PDF via email

      return {
        success: true,
        message: "Success! Check your email for the Fair Price Cheat Sheet.",
      };
    }),
});