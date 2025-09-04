import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const alphaRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({
      forumUsername: z.string().min(3).max(50),
      email: z.string().email(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists
      const existing = await ctx.db.alphaTester.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new Error("This email is already registered for alpha testing");
      }

      // Create alpha tester
      const alphaTester = await ctx.db.alphaTester.create({
        data: {
          forumUsername: input.forumUsername,
          email: input.email,
        },
      });

      // TODO: Send welcome email to alpha tester

      return {
        success: true,
        message: "Thank you for joining our alpha test! Check your email for access instructions.",
      };
    }),
});