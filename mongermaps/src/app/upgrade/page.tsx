"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { AppShell } from "~/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { 
  Crown, 
  Bitcoin, 
  Check, 
  Shield, 
  Zap, 
  Lock,
  FileText,
  Users,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

export default function UpgradePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: currentSubscription } = api.subscription.current.useQuery();
  
  const createBtcInvoice = api.subscription.createAnnualCheckout.useMutation({
    onSuccess: (data) => {
      if (data.btcPayUrl) {
        window.location.href = data.btcPayUrl;
      }
    },
    onError: () => {
      setIsProcessing(false);
      // TODO: Show error toast
    },
  });

  if (!session) {
    router.push("/auth/signin?redirect=/upgrade");
    return null;
  }

  const handleBitcoinPayment = () => {
    setIsProcessing(true);
    createBtcInvoice.mutate();
  };

  const features = [
    {
      icon: FileText,
      title: "The Blacklist of Scammers",
      description: "Real-time database of known scammers and their tactics",
    },
    {
      icon: Shield,
      title: "The BBFS Operator's Protocol",
      description: "Insider knowledge on who offers what, verified by the community",
    },
    {
      icon: Calendar,
      title: "The 'Perfect Week' Itinerary Vault",
      description: "Curated itineraries from veteran mongers for every budget",
    },
    {
      icon: FileText,
      title: "The Veteran's Pre-Flight Checklist",
      description: "Everything you need to know before your trip",
    },
    {
      icon: Users,
      title: "The Monthly 'Insider Intel' Briefing",
      description: "Exclusive updates on scene changes, new venues, and warnings",
    },
    {
      icon: Zap,
      title: "Priority Report Processing",
      description: "Your reports get processed and published immediately",
    },
  ];

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Crown className="h-10 w-10 text-yellow-400" />
            Get the Insider's Edge
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The Trip Pass is for a vacation. The Annual Membership is for the lifestyle.
          </p>
        </div>

        {/* Pricing Card */}
        <Card className="bg-gradient-to-b from-yellow-900/20 to-gray-900 border-yellow-700">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl text-white">Annual All-Access Membership</CardTitle>
            <CardDescription className="text-lg mt-2">
              <span className="line-through text-gray-500">$299/year</span>
            </CardDescription>
            <div className="mt-4">
              <div className="text-5xl font-bold text-yellow-400">$199</div>
              <p className="text-gray-400 mt-2">Just $16.50/month, billed annually</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Method */}
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Bitcoin className="h-6 w-6 text-orange-500" />
                <span className="text-xl font-bold text-white">Bitcoin Only</span>
              </div>
              <p className="text-gray-400 mb-4">
                Maximum privacy. No credit card trail. No questions asked.
              </p>
              <Button
                onClick={handleBitcoinPayment}
                disabled={isProcessing || currentSubscription?.type === "ANNUAL"}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3"
              >
                {isProcessing ? "Creating Invoice..." : "Pay with Bitcoin"}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Powered by BTCPay Server • Zero logs • Zero tracking
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-4">Exclusive Annual Member Benefits:</h3>
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <feature.icon className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Guarantee */}
            <Card className="bg-green-900/20 border-green-700">
              <CardHeader>
                <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  The 'GFE Home Run' Guarantee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  If MongerMaps doesn't help you find at least one "home run" experience that makes your entire year, 
                  we'll refund your membership. No questions asked.
                </p>
              </CardContent>
            </Card>

            {/* Alternative Payment Note */}
            <div className="text-center text-sm text-gray-500">
              <p>Need to pay with card? Contact support for special arrangements.</p>
              <p className="mt-1">We prioritize privacy but understand not everyone uses Bitcoin.</p>
            </div>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400">2,741</div>
              <p className="text-gray-400 mt-1">Active Members</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400">98%</div>
              <p className="text-gray-400 mt-1">Renewal Rate</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400">4.9/5</div>
              <p className="text-gray-400 mt-1">Member Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-1">Why Bitcoin only?</h4>
              <p className="text-sm text-gray-400">
                Privacy is paramount. Bitcoin leaves no trail on your credit card statement. 
                Your wife, girlfriend, or bank will never know.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">What if I don't have Bitcoin?</h4>
              <p className="text-sm text-gray-400">
                It's easier than you think. Buy Bitcoin instantly on Cash App, Strike, or any major exchange. 
                Takes 5 minutes. We have a guide if you need help.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Is this really worth $199?</h4>
              <p className="text-sm text-gray-400">
                One bad experience costs more than a year of membership. Our intel pays for itself on your first night.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Can I share my account?</h4>
              <p className="text-sm text-gray-400">
                No. Each membership is tied to a single anonymous username. Sharing violates our terms and results in immediate termination.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}