"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { 
  CheckCircle, 
  MapPin, 
  TrendingUp, 
  MessageSquare, 
  FileText,
  Gift,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, update } = useSession();
  
  // Check if coming from Stripe checkout
  const sessionId = searchParams.get("session_id");
  
  useEffect(() => {
    // Force session update to get new subscription status
    if (sessionId && session) {
      update();
    }
  }, [sessionId, session, update]);
  
  const features = [
    {
      icon: MapPin,
      title: "Interactive Map Access",
      description: "View all 200+ venues with real-time vibe scores and pricing"
    },
    {
      icon: TrendingUp,
      title: "Live Intelligence Feed",
      description: "Get instant updates from the field as they happen"
    },
    {
      icon: FileText,
      title: "Full Report Database",
      description: "Access 200,000+ field reports with advanced search"
    },
    {
      icon: MessageSquare,
      title: "Member Chat Access",
      description: "Join private discussions with experienced members"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl mb-2">Welcome to MongerMaps!</CardTitle>
          <p className="text-muted-foreground">
            Your annual membership is now active. Here's what you can access:
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Member badge */}
          <div className="flex justify-center">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-2 text-lg">
              <Gift className="h-5 w-5 mr-2" />
              Premium Member
            </Badge>
          </div>
          
          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Quick tips */}
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-blue-500">💡</span>
                Pro Tips to Get Started
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Check the dashboard daily for the latest vibe shifts</li>
                <li>• Use the map filters to find venues matching your preferences</li>
                <li>• Submit reports after visits to help the community</li>
                <li>• Join the live chat for real-time recommendations</li>
              </ul>
            </CardContent>
          </Card>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              asChild 
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
            >
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/map/pattaya">
                Explore Map
                <MapPin className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          {/* Referral reminder */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Refer 4 friends and get your next year free!
              <Link href="/profile" className="text-yellow-500 ml-1 hover:underline">
                Get your referral link →
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}