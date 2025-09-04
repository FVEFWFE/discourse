"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Shell } from "~/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { DataTable } from "~/components/data-table";
import { columns } from "~/components/intel-columns";
import { PaywallModal } from "~/components/paywall-modal";
import { 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  ArrowUp, 
  ArrowDown,
  PlusCircle, 
  X, 
  Lock,
  Eye,
  EyeOff 
} from "lucide-react";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";

export default function Dashboard() {
  const { data: session } = useSession();
  const [filter, setFilter] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<string>("");
  
  // Fetch dashboard metrics
  const { data: metrics, isLoading: metricsLoading } = api.intelligence.getDashboardMetrics.useQuery({
    city: "pattaya"
  });
  
  // Fetch live intel feed
  const { data: intelFeed, isLoading: feedLoading } = api.intelligence.getLiveIntelFeed.useQuery({
    city: "pattaya",
    limit: 10,
    filter: filter || undefined
  });
  
  // Fetch top venues
  const { data: topVenues, isLoading: venuesLoading } = api.intelligence.getTopVenues.useQuery({
    city: "pattaya",
    limit: 3
  });
  
  const isPaid = session?.user?.isPaid;
  
  const handleUnlockFeature = (feature: string) => {
    setPaywallFeature(feature);
    setShowPaywall(true);
  };
  
  // Format KPI data based on real metrics
  const kpiData = metrics ? [
    {
      title: "Pattaya Vibe Shift (24h)",
      value: metrics.vibeShift ? (parseFloat(metrics.vibeShift) > 0 ? `+${metrics.vibeShift}` : metrics.vibeShift) : "0",
      subtext: parseFloat(metrics.vibeShift || "0") > 0 ? "Vibe Score™ rising" : "Vibe Score™ stable",
      analysisText: `Analysis based on ${metrics.reportCount} new reports`,
      positive: parseFloat(metrics.vibeShift || "0") > 0 ? true : parseFloat(metrics.vibeShift || "0") < 0 ? false : null,
    },
    {
      title: "Fair Price: Soi 6 ST",
      value: metrics.fairPrice ? `${metrics.fairPrice} THB` : "N/A",
      subtext: "Market average",
      touristPrice: metrics.fairPrice ? `${Math.round(metrics.fairPrice * 1.5)} THB` : null,
      positive: null,
    },
    {
      title: "New Reports Processed (6h)",
      value: metrics.reportCount?.toString() || "0",
      subtext: isPaid ? "From multiple venues" : "Unlock for details",
      positive: null,
      locked: !isPaid,
    },
    {
      title: "Active Scam Alerts",
      value: metrics.activeAlerts?.toString() || "0",
      subtext: "Pattaya Zone",
      positive: metrics.activeAlerts === 0,
    },
  ] : [];
  
  const isLoading = metricsLoading || feedLoading || venuesLoading;

  return (
    <Shell>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Intelligence Briefing</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? "Loading..." : "Last updated: 7 minutes ago via automated scrape"}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <Card 
              key={index} 
              className={cn(
                "relative overflow-hidden transition-all",
                kpi.locked && "cursor-pointer hover:shadow-lg"
              )}
              onClick={() => kpi.locked && handleUnlockFeature("detailed metrics")}
            >
              {kpi.locked && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-yellow-500" />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div
                    className={cn(
                      "text-2xl font-bold",
                      kpi.positive === true && "text-green-500",
                      kpi.positive === false && "text-red-500",
                      kpi.positive === null && "text-foreground"
                    )}
                  >
                    {kpi.value}
                  </div>
                  {kpi.positive === true && <ArrowUp className="h-5 w-5 text-green-500" />}
                  {kpi.positive === false && <ArrowDown className="h-5 w-5 text-red-500" />}
                </div>
                <p
                  className={cn(
                    "text-xs mt-1",
                    kpi.positive === true && "text-green-500",
                    kpi.positive === false && "text-red-500",
                    kpi.positive === null && "text-muted-foreground"
                  )}
                >
                  {kpi.subtext}
                </p>
                {kpi.touristPrice && <p className="text-xs mt-1 text-red-500">Tourist Price: {kpi.touristPrice}</p>}
                {kpi.analysisText && <p className="text-xs mt-1 text-muted-foreground">{kpi.analysisText}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Tonight's Watchlist */}
          <div className="xl:order-1 order-2">
            <Card className={cn(!isPaid && "relative overflow-hidden")}>
              {!isPaid && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-end p-4">
                  <Button 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                    onClick={() => handleUnlockFeature("watchlist & recommendations")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Unlock Watchlist
                  </Button>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Tonight's Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topVenues?.map((venue, index) => (
                  <div key={index} className={cn("flex justify-between items-center group", !isPaid && "blur-sm")}>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{venue.name}</span>
                      <Badge
                        variant={venue.score > 8.5 ? "default" : venue.score > 7 ? "secondary" : "destructive"}
                        className={venue.score > 8.5 ? "bg-green-500" : ""}
                      >
                        {venue.score.toFixed(1)}
                      </Badge>
                    </div>
                    {isPaid && (
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                {isPaid && (
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Venue
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Intel Feed */}
          <div className="xl:col-span-2 xl:order-2 order-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Live Intel Feed
                  {!isPaid && (
                    <Badge variant="secondary" className="ml-auto">
                      <Lock className="h-3 w-3 mr-1" />
                      Limited View
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Filter by venue..." 
                    className="max-w-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  {!isPaid && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnlockFeature("full search & filters")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Unlock All
                    </Button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  {intelFeed && (
                    <DataTable 
                      columns={columns} 
                      data={intelFeed.data} 
                    />
                  )}
                  {!isPaid && intelFeed?.hasMore && (
                    <div className="mt-4 text-center">
                      <Button
                        onClick={() => handleUnlockFeature("all field reports")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        View All {intelFeed.data.length}+ Reports
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 xl:order-3 order-3">
            <Card className={cn(!isPaid && "relative overflow-hidden")}>
              {!isPaid && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 flex items-end p-4">
                  <Button 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-sm"
                    onClick={() => handleUnlockFeature("personalized game plans")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Unlock
                  </Button>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Tonight's Game Plan
                </CardTitle>
              </CardHeader>
              <CardContent className={cn("space-y-3", !isPaid && "blur-sm")}>
                {topVenues?.slice(0, 3).map((venue, index) => (
                  <div key={index} className="flex justify-between items-center group">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{venue.name}</span>
                      <Badge
                        variant={venue.score > 8.5 ? "default" : venue.score > 7 ? "secondary" : "destructive"}
                        className={venue.score > 8.5 ? "bg-green-500" : ""}
                      >
                        {venue.score.toFixed(1)}
                      </Badge>
                    </div>
                    {isPaid && (
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                {isPaid && (
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Venue
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-red-500/50">
              <CardHeader className="bg-red-500/10">
                <CardTitle className="text-sm flex items-center gap-2 text-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  Active Scam Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {isPaid ? (
                  <p className="text-sm">
                    <strong className="text-red-500">ALERT:</strong> Bill padding at 'XYZ Bar' on Walking Street.
                    <Button variant="link" className="p-0 h-auto text-red-500 ml-1 underline">
                      Open Dossier for details
                    </Button>
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {metrics?.activeAlerts || 0} active alerts in your area
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleUnlockFeature("scam alerts & safety warnings")}
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      View Alerts
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={paywallFeature}
      />
    </Shell>
  );
}