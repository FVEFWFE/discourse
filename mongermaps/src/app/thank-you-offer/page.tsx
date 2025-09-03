"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function ThankYouOfferPage() {
  const { data: session } = useSession();
  const createCheckout = api.subscription.createTripPassCheckout.useMutation();

  const handleTripPassPurchase = async () => {
    if (!session) {
      // Redirect to sign up if not logged in
      window.location.href = "/auth/signup?redirect=/thank-you-offer";
      return;
    }

    try {
      const result = await createCheckout.mutateAsync();
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Success Message */}
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">
            Success! Your Cheat Sheet is on its way...
          </h1>
          <p className="text-gray-300">
            Check your email in the next 5 minutes for your Fair Price Cheat Sheet.
          </p>
        </div>

        {/* The Hook */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">
            But what good is knowing the price if you still end up with a 'starfish'?
          </h2>
        </div>

        {/* The Offer */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-yellow-400 mb-4">
              Get Your 7-Day Pattaya Trip Pass
            </h3>
            <p className="text-5xl font-bold text-white mb-2">$29</p>
            <p className="text-gray-400">One-time payment. No recurring charges.</p>
          </div>

          {/* Value Proposition */}
          <div className="space-y-6 mb-8">
            <p className="text-lg text-gray-300">
              The Cheat Sheet gives you the <strong>price</strong>. The full MongerMaps platform gives you the <strong>quality</strong>.
            </p>
            
            <p className="text-gray-300">
              For less than the cost of a few lady drinks, get full, unlimited access to:
            </p>

            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong>Live Interactive Maps</strong> - See exactly which venues have the best GFE scores right now</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong>Real-Time Reports</strong> - Fresh intel from mongers on the ground (updated hourly)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong>Scam Alerts</strong> - Know which girls and venues to avoid</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong>Quality Scores™</strong> - Our proprietary algorithm rates every venue based on 10+ factors</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span><strong>The "Starfish Detector"</strong> - Crowd-sourced ratings help you avoid dead fish</span>
              </li>
            </ul>
          </div>

          {/* Guarantee */}
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-8">
            <h4 className="text-xl font-bold text-yellow-400 mb-2">
              100% "Save Your Trip" Guarantee
            </h4>
            <p className="text-gray-300">
              If MongerMaps doesn't save you at least double its cost in avoided rip-offs and bad experiences, we'll refund you 100%. No questions asked.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleTripPassPurchase}
              disabled={createCheckout.isPending}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-4 px-6 rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xl"
            >
              {createCheckout.isPending ? "Processing..." : "Activate My 7-Day Trip Pass"}
            </button>
            
            <Link 
              href="/download"
              className="block w-full text-center text-gray-500 hover:text-gray-400 text-sm"
            >
              No thanks, I'll take my chances with the starfish
            </Link>
          </div>
        </div>

        {/* Social Proof */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center text-white mb-6">
            What Other Mongers Are Saying:
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-300 italic mb-2">
                "Saved me from getting ripped off on Walking Street. The real-time pricing alone paid for itself on the first night."
              </p>
              <p className="text-gray-500 text-sm">- PattayaVet2019</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-300 italic mb-2">
                "The GFE scores are spot on. Found a gem in Soi 6 I never would have tried without this."
              </p>
              <p className="text-gray-500 text-sm">- BangkokBob88</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-300 italic mb-2">
                "Finally, real data instead of outdated forum posts. This is what we've been asking for."
              </p>
              <p className="text-gray-500 text-sm">- ISGVeteran</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}