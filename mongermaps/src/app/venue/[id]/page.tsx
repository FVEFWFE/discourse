"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { AppShell } from "~/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { 
  MapPin, 
  Star, 
  DollarSign, 
  FileText, 
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Calendar
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export default function VenuePage() {
  const params = useParams();
  const venueId = params.id as string;
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: venue, isLoading, refetch } = api.venue.getById.useQuery({ id: venueId });
  
  const submitReport = api.report.submitManualReport.useMutation({
    onSuccess: () => {
      setReportText("");
      setIsSubmitting(false);
      refetch();
      // TODO: Show success toast
    },
    onError: () => {
      setIsSubmitting(false);
      // TODO: Show error toast
    },
  });

  const handleSubmitReport = () => {
    if (!reportText.trim()) return;
    setIsSubmitting(true);
    submitReport.mutate({
      text: reportText,
      venueId,
    });
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-800 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!venue) {
    return (
      <AppShell>
        <div className="p-8">
          <p className="text-gray-400">Venue not found.</p>
        </div>
      </AppShell>
    );
  }

  const avgScore = venue.avgGfeScore || 0;
  const totalReports = venue._count.reports;

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{venue.name}</h1>
              <div className="flex items-center gap-3 text-gray-400">
                <Badge variant="secondary">
                  {venue.type.replace('_', ' ')}
                </Badge>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {venue.district}
                </span>
                {venue.address && (
                  <span className="text-sm">{venue.address}</span>
                )}
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Submit Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Submit Exclusive Report</DialogTitle>
                  <DialogDescription>
                    Share your experience at {venue.name}. Our AI will analyze and structure it for the community.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="Paste your trip report here. Our AI will analyze and structure it for the community. Be as detailed as possible."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitReport}
                    disabled={isSubmitting || !reportText.trim()}
                  >
                    {isSubmitting ? "Processing..." : "Submit Report"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overall Player Score */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Overall Player Score™
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {avgScore.toFixed(1)}/10
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Based on {totalReports} reports
              </p>
            </CardContent>
          </Card>

          {/* Average Price */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Average Price
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {venue.avgPriceST && (
                  <div>
                    <span className="text-lg font-bold text-white">฿{venue.avgPriceST.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">ST</span>
                  </div>
                )}
                {venue.avgPriceLT && (
                  <div>
                    <span className="text-lg font-bold text-white">฿{venue.avgPriceLT.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">LT</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Report Activity */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Report Activity
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalReports}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total reports submitted
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Field Reports</CardTitle>
            <p className="text-sm text-gray-400">Anonymous reports from verified mongers</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {venue.reports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No reports yet. Be the first to submit one!
                </p>
              ) : (
                venue.reports.map((report) => (
                  <div key={report.id} className="bg-gray-800 rounded-lg p-4 space-y-3">
                    {/* Report Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">
                          @{report.user.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          Visit: {new Date(report.visitDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Scores and Prices */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">GFE Score:</span>
                        <span className={`ml-2 font-bold ${report.gfeScore >= 8 ? 'text-green-400' : report.gfeScore < 7 ? 'text-red-400' : 'text-yellow-400'}`}>
                          {report.gfeScore}/10
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Service:</span>
                        <span className="ml-2 font-bold text-white">{report.serviceQuality}/10</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Looks:</span>
                        <span className="ml-2 font-bold text-white">{report.attractiveness}/10</span>
                      </div>
                      {(report.priceST || report.priceLT) && (
                        <div>
                          <span className="text-gray-400">Paid:</span>
                          <span className="ml-2 font-bold text-yellow-400">
                            ฿{(report.priceST || report.priceLT || 0).toLocaleString()} 
                            <span className="text-xs text-gray-500 ml-1">
                              ({report.priceST ? 'ST' : 'LT'})
                            </span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2">
                      {report.bbfsOffered && (
                        <Badge variant="destructive" className="text-xs">
                          BBFS
                        </Badge>
                      )}
                      {report.starfishRating && report.starfishRating <= 3 && (
                        <Badge variant="destructive" className="text-xs">
                          Starfish
                        </Badge>
                      )}
                      {report.gfeScore >= 8 && (
                        <Badge variant="default" className="text-xs">
                          GFE
                        </Badge>
                      )}
                    </div>

                    {/* Comment */}
                    {report.comment && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-sm text-gray-300">{report.comment}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}