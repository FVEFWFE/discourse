"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { CheckCircle, Lock } from "lucide-react";
import { api } from "~/trpc/react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export function PaywallModal({ isOpen, onClose, feature }: PaywallModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const leadMutation = api.lead.create.useMutation({
    onSuccess: () => {
      // Redirect to download page after email capture
      router.push("/download");
    },
  });

  const handleEmailCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      await leadMutation.mutateAsync({ email });
    } catch (error) {
      console.error("Error capturing email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: "annual" }),
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error starting checkout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-12 w-12 text-yellow-500" />
          </div>
          <DialogTitle className="text-2xl text-center">
            Get Instant Intelligence Access
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400 mt-2">
            {feature ? `Unlock ${feature} and all premium features` : "Join 2,000+ members getting real-time intelligence"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Free lead magnet offer */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Get Started Free</h3>
            <p className="text-sm text-gray-400 mb-3">
              Download our Pattaya Fair Price Sheet and get insider tips
            </p>
            <form onSubmit={handleEmailCapture} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600"
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                Get Free PDF
              </Button>
            </form>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">Or</span>
            </div>
          </div>
          
          {/* Paid subscription offer */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">Annual Access</h3>
                  <p className="text-sm opacity-90">Full platform access</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">$99</div>
                  <div className="text-xs opacity-90">per year</div>
                </div>
              </div>
            </div>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Real-time venue intelligence & vibe scores</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Live pricing data to avoid tourist prices</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Scam alerts & safety warnings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Access to 200,000+ field reports</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Private member chat & insider tips</span>
              </li>
            </ul>
            
            <Button 
              onClick={handleCheckout}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg py-6"
              disabled={isLoading}
            >
              Unlock Full Access - $99/year
            </Button>
            
            <p className="text-xs text-center text-gray-400">
              30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}