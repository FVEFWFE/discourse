import { z } from "zod";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(z.object({
      username: z.string().min(3).max(20),
      email: z.string().email().optional().or(z.literal("")),
      password: z.string().min(6),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if username already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { username: input.username },
      });

      if (existingUser) {
        throw new Error("Username already taken");
      }

      // Check if email already exists (if provided)
      if (input.email) {
        const existingEmail = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (existingEmail) {
          throw new Error("Email already registered");
        }
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Create the user
      const user = await ctx.db.user.create({
        data: {
          username: input.username,
          email: input.email || null,
          password: hashedPassword,
        },
      });

      return {
        id: user.id,
        username: user.username,
      };
    }),
});