"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Shell } from "~/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { PaywallModal } from "~/components/paywall-modal";
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  AlertTriangle,
  Lock,
  MessageSquare,
  FileText,
  BarChart3
} from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function VenuePage() {
  const params = useParams();
  const { data: session } = useSession();
  const [showPaywall, setShowPaywall] = useState(false);
  
  const venueId = params.id as string;
  const isPaid = session?.user?.isPaid;
  
  // Mock data for demonstration - in production this would come from tRPC
  const venue = {
    id: venueId,
    name: "Sapphire A Go Go",
    type: "GOGO_BAR",
    district: "Walking Street",
    vibeScore: 9.2,
    avgPriceST: 1800,
    avgPriceLT: 3500,
    totalReports: 247,
    lastUpdate: new Date().toISOString(),
    description: "One of Walking Street's premier go-go bars, known for high quality and professional service.",
    workingHours: "8:00 PM - 2:00 AM",
    coordinates: { lat: 12.9236, lng: 100.8782 }
  };
  
  const recentReports = [
    {
      id: "1",
      date: "2 hours ago",
      username: "Veteran_82",
      score: 9.5,
      priceST: 2000,
      service: "ST",
      comment: "Great experience, highly recommended. Professional and friendly.",
      tags: ["GFE", "BBFS"]
    },
    {
      id: "2", 
      date: "5 hours ago",
      username: "Explorer_99",
      score: 8.8,
      priceST: 1800,
      service: "ST",
      comment: "Good selection, fair prices. Avoid the mamasan in red dress - pushy.",
      tags: ["GFE"]
    },
    {
      id: "3",
      date: "1 day ago",
      username: "Nightowl_77",
      score: 9.0,
      priceLT: 3500,
      service: "LT",
      comment: "Consistent quality. Best time to visit is around 10 PM.",
      tags: ["GFE", "BBBJ"]
    }
  ];
  
  const handleUnlockFeature = (feature: string) => {
    setShowPaywall(true);
  };

  return (
    <Shell>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{venue.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{venue.district}</span>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{venue.workingHours}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="default" 
              className="bg-green-500 text-white text-lg px-4 py-2"
            >
              <Star className="h-5 w-5 mr-1" />
              {venue.vibeScore.toFixed(1)}
            </Badge>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vibe Score™</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{venue.vibeScore.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-1">Based on {venue.totalReports} reports</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fair Price (ST)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{venue.avgPriceST} THB</div>
              <p className="text-xs text-red-500 mt-1">Tourist price: {Math.round(venue.avgPriceST * 1.5)} THB</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fair Price (LT)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{venue.avgPriceLT} THB</div>
              <p className="text-xs text-red-500 mt-1">Tourist price: {Math.round(venue.avgPriceLT * 1.5)} THB</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Last Intel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h ago</div>
              <p className="text-xs text-muted-foreground mt-1">247 total reports</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2" />
              Field Reports
            </TabsTrigger>
            <TabsTrigger value="trends">
              <BarChart3 className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" />
              Live Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Field Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isPaid ? (
                  recentReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{report.username}</span>
                          <span className="text-muted-foreground text-sm">{report.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            Score: {report.score}
                          </Badge>
                          <Badge variant="outline">
                            {report.service}: {report.priceST || report.priceLT} THB
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm">{report.comment}</p>
                      <div className="flex gap-1">
                        {report.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="space-y-4">
                    {/* Show blurred preview for non-paid users */}
                    {recentReports.slice(0, 2).map((report) => (
                      <div key={report.id} className="border rounded-lg p-4 space-y-2 relative">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                          <Lock className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div className="blur-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Hidden_User</span>
                              <span className="text-muted-foreground text-sm">{report.date}</span>
                            </div>
                          </div>
                          <p className="text-sm">Lorem ipsum dolor sit amet...</p>
                        </div>
                      </div>
                    ))}
                    <Button 
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                      onClick={() => handleUnlockFeature("all field reports")}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Unlock All {venue.totalReports} Reports
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Price & Vibe Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {isPaid ? (
                  <div className="space-y-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                      <p>Interactive charts showing price and vibe score trends over time</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                    <p className="text-muted-foreground mb-4">Historical trends are available to members only</p>
                    <Button 
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      onClick={() => handleUnlockFeature("trend analysis")}
                    >
                      Unlock Trend Analysis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-6">
            <Card>
              <CardHeader className="bg-red-500/10">
                <CardTitle className="text-red-500 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {isPaid ? (
                  <div className="space-y-3">
                    <div className="border-l-4 border-red-500 pl-4">
                      <p className="font-semibold">Bill Padding Warning</p>
                      <p className="text-sm text-muted-foreground">
                        Multiple reports of inflated bills. Always check prices before ordering.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Reported 3 days ago</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      {venue.name} has active alerts
                    </p>
                    <Button 
                      variant="outline"
                      className="border-red-500 text-red-500"
                      onClick={() => handleUnlockFeature("safety alerts")}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      View Alerts
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Member Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  {isPaid ? (
                    <>
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Chat feature coming soon</p>
                    </>
                  ) : (
                    <>
                      <Lock className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                      <p className="text-muted-foreground mb-4">Join the conversation with other members</p>
                      <Button 
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                        onClick={() => handleUnlockFeature("member chat")}
                      >
                        Unlock Member Chat
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="full venue intelligence"
      />
    </Shell>
  );
}