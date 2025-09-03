"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const leadCapture = api.lead.capture.useMutation({
    onSuccess: () => {
      router.push("/thank-you-offer");
    },
    onError: (error) => {
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    leadCapture.mutate({ email });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Get The Pattaya Fair Price Cheat Sheet
          </h1>
          <h2 className="text-2xl text-gray-300">
            (2025 Data)
          </h2>
        </header>

        {/* Sub-headline */}
        <div className="text-center mb-12">
          <p className="text-xl text-gray-300 font-semibold">
            Stop Overpaying. We Analyzed 10,000+ Recent Reports to Reveal the Real-Time ST/LT Prices for Soi 6, Walking Street & GCs.
          </p>
        </div>

        {/* Visual - Cheat Sheet Mockup */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
            <div className="bg-gray-900 p-6 rounded">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                📊 Fair Price Cheat Sheet - Pattaya 2025
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Soi 6 (Day):</span>
                  <span className="text-green-400">ST: 1000-1500 THB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Walking Street GoGo:</span>
                  <span className="text-green-400">ST: 2500-3500 THB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gentlemen's Clubs:</span>
                  <span className="text-green-400">ST: 3000-5000 THB</span>
                </div>
                <div className="mt-4 text-gray-500 text-xs">
                  + 15 more venues with current prices...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body Copy */}
        <div className="mb-12 space-y-6 text-gray-300">
          <p className="text-lg">
            <strong>Tired of delusional prices?</strong> Still relying on ISG posts from 2019?
          </p>
          
          <p>
            I got sick of the outdated information, so I spent 1000 hours analyzing 2.6M+ forum posts to extract the <em>real</em> prices being paid right now.
          </p>
          
          <p>
            This isn't marketing bullshit. It's data-backed intelligence from actual mongers on the ground.
          </p>
          
          <p className="text-yellow-400 font-semibold">
            Get the data-backed edge. For free.
          </p>
        </div>

        {/* CTA Form */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Enter your email to get instant access:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white placeholder-gray-500"
                disabled={isSubmitting}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-4 px-6 rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Send Me The Free Cheat Sheet"}
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              We respect your privacy. No spam, ever. Unsubscribe anytime.
            </p>
          </form>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 text-center text-gray-400">
          <p className="mb-4">Trusted by 10,000+ mongers worldwide</p>
          <div className="flex justify-center space-x-8">
            <div>
              <span className="text-2xl font-bold text-yellow-400">2.6M+</span>
              <p className="text-sm">Posts Analyzed</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-yellow-400">1000+</span>
              <p className="text-sm">Hours of Research</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-yellow-400">100%</span>
              <p className="text-sm">Data-Driven</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}