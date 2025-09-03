import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Stripe from "stripe";
import { env } from "~/env";

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
}) : null;

export const subscriptionRouter = createTRPCRouter({
  current: protectedProcedure
    .query(async ({ ctx }) => {
      const subscription = await ctx.db.subscription.findFirst({
        where: {
          userId: ctx.session.user.id,
          status: "ACTIVE",
          OR: [
            { endDate: null },
            { endDate: { gte: new Date() } }
          ]
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return subscription;
    }),

  createTripPassCheckout: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (!stripe) {
        throw new Error("Stripe is not configured");
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "MongerMaps 7-Day Trip Pass",
                description: "Full access to all MongerMaps features for 7 days",
              },
              unit_amount: 2900, // $29.00
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.NEXTAUTH_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.NEXTAUTH_URL}/thank-you-offer`,
        metadata: {
          userId: ctx.session.user.id,
          subscriptionType: "TRIP_PASS",
        },
      });

      return { checkoutUrl: session.url };
    }),

  createAnnualCheckout: protectedProcedure
    .mutation(async ({ ctx }) => {
      // For annual subscriptions, we use BTCPay Server
      // This is a placeholder - implement BTCPay integration
      
      return {
        btcPayUrl: `${env.BTCPAY_SERVER_URL}/invoice?storeId=${env.BTCPAY_STORE_ID}`,
      };
    }),

  confirmStripePayment: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!stripe) {
        throw new Error("Stripe is not configured");
      }

      const session = await stripe.checkout.sessions.retrieve(input.sessionId);

      if (session.payment_status === "paid" && session.metadata?.userId === ctx.session.user.id) {
        // Create subscription
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // 7 days for Trip Pass

        await ctx.db.subscription.create({
          data: {
            userId: ctx.session.user.id,
            type: "TRIP_PASS",
            status: "ACTIVE",
            startDate: new Date(),
            endDate,
            stripeSessionId: session.id,
            amount: 2900,
          },
        });

        return { success: true };
      }

      throw new Error("Payment not completed or unauthorized");
    }),
});