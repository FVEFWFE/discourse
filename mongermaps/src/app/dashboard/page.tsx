"use client";

import { api } from "~/trpc/react";
import { AppShell } from "~/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { data, isLoading } = api.dashboard.getDashboardData.useQuery();

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-800 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell>
        <div className="p-8">
          <p className="text-gray-400">Failed to load dashboard data.</p>
        </div>
      </AppShell>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Intelligence Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time mongering intelligence from the field</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pattaya Vibe Shift */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Pattaya Vibe Shift™
              </CardTitle>
              {getTrendIcon(data.kpis.vibeShift.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {data.kpis.vibeShift.value > 0 ? '+' : ''}{data.kpis.vibeShift.value.toFixed(1)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Current avg: {data.kpis.vibeShift.currentAvg.toFixed(1)}/10
              </p>
            </CardContent>
          </Card>

          {/* Fair Price */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Fair Price™
              </CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ฿{data.kpis.fairPrice.value.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {data.kpis.fairPrice.location}
              </p>
            </CardContent>
          </Card>

          {/* New Reports */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                New Reports
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {data.kpis.newReports.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Last {data.kpis.newReports.timeframe}
              </p>
            </CardContent>
          </Card>

          {/* Scam Alerts */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Active Scam Alerts
              </CardTitle>
              <AlertTriangle className={`h-4 w-4 ${data.kpis.scamAlerts.value > 0 ? 'text-red-400' : 'text-green-400'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {data.kpis.scamAlerts.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Status: {data.kpis.scamAlerts.status === 'clear' ? 'All Clear' : 'Active Threats'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Live Intel Feed */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Live Intel Feed</CardTitle>
            <p className="text-sm text-gray-400">Latest verified reports from the field</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.latestReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{report.venueName}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {report.venueType.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-gray-500">• {report.district}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-300">
                        Player Score: <span className={`font-bold ${report.playerScore >= 8 ? 'text-green-400' : report.playerScore < 7 ? 'text-red-400' : 'text-yellow-400'}`}>
                          {report.playerScore}/10
                        </span>
                      </span>
                      <span className="text-gray-300">
                        Paid: <span className="font-bold text-yellow-400">฿{report.pricePaid}</span> ({report.serviceType})
                      </span>
                      <span className="text-gray-500">
                        by @{report.reportedBy}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {report.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant={tag === 'GFE' ? 'default' : tag === 'Starfish' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      <span className="text-xs text-gray-500 ml-auto">
                        {formatDistanceToNow(new Date(report.reportedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <Link href={`/venue/${report.venueId}`}>
                    <Button variant="ghost" size="sm" className="ml-4">
                      Open Dossier
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}