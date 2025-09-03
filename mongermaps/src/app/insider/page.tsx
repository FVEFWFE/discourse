"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function InsiderPage() {
  const [forumUsername, setForumUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const alphaRegister = api.alpha.register.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error) => {
      alert(error.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forumUsername || !email) return;

    setIsSubmitting(true);
    alphaRegister.mutate({ forumUsername, email });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 max-w-2xl">
          <h2 className="text-3xl font-bold text-green-400 mb-4">Welcome to the Inner Circle</h2>
          <p className="text-gray-300 mb-4">
            Thank you for joining our alpha test. Check your email for access instructions.
          </p>
          <p className="text-gray-400 text-sm">
            You're one of the first 100 founding members. Your feedback will shape the future of mongering intelligence.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-yellow-400">
            You're Invited to Beta Test the Future of Mongering Intelligence
          </h1>
        </header>

        {/* Body Copy */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700 mb-8">
          <div className="space-y-6 text-gray-300">
            <p className="text-lg">
              I've been lurking on ISG for years, watching the same questions get asked over and over:
            </p>
            
            <ul className="space-y-2 ml-6">
              <li>• "What are current prices?"</li>
              <li>• "Which venues have the best GFE?"</li>
              <li>• "How do I avoid getting ripped off?"</li>
            </ul>
            
            <p>
              <strong>I got sick of outdated forums, so I spent 1000 hours analyzing 2.6M+ posts to build the tool we've all been asking for.</strong>
            </p>
            
            <p>
              This isn't another review site. It's a private intelligence platform - think Bloomberg Terminal meets mongering. Real-time data, verified reports, and the collective wisdom of thousands of mongers, all in one place.
            </p>
            
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 my-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">The Offer:</h3>
              <p>
                I'm giving 100 respected veterans <strong>free, lifetime access</strong> in exchange for your honest feedback to help me build this right.
              </p>
              <p className="mt-2 text-sm">
                No credit card required. No catch. Just pure value for the community.
              </p>
            </div>
            
            <p className="text-sm text-gray-400">
              Why free? Because I need real mongers to validate this before public launch. Your experience and feedback are worth more than any payment.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-white">Claim Your Founding Member Access</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="forumUsername" className="block text-sm font-medium mb-2">
                Your ISG Forum Username
              </label>
              <input
                type="text"
                id="forumUsername"
                value={forumUsername}
                onChange={(e) => setForumUsername(e.target.value)}
                required
                placeholder="Your forum handle"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400 text-white placeholder-gray-500"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll verify your veteran status (100+ quality posts)
              </p>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Private Email Address
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
              <p className="text-xs text-gray-500 mt-1">
                Never shared. Used only for login credentials.
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-4 px-6 rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Request Alpha Access"}
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              Limited to first 100 qualified veterans. Your data is encrypted and never sold.
            </p>
          </form>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center text-gray-400">
          <p className="mb-2">Built by mongers, for mongers.</p>
          <p className="text-sm">No corporate BS. No marketing hype. Just data.</p>
        </div>
      </div>
    </main>
  );
}