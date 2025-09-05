import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to subscribe" },
        { status: 401 }
      );
    }
    
    const { priceId } = await req.json();
    
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "MongerMaps Annual Access",
              description: "Real-time intelligence for Pattaya and beyond. Full access to all features, venue data, field reports, and member chat.",
              images: ["https://mongermaps.io/logo.png"], // Update with actual logo
            },
            unit_amount: 9900, // $99.00
            recurring: {
              interval: "year",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/dashboard`,
      customer_email: session.user.email || undefined,
      client_reference_id: session.user.id,
      metadata: {
        userId: session.user.id,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
        },
      },
    });
    
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}