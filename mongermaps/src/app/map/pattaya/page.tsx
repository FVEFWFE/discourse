"use client";

import { useState, useMemo, useCallback } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { api } from "~/trpc/react";
import { AppShell } from "~/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { Checkbox } from "~/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { MapPin, Filter } from "lucide-react";
import Link from "next/link";
import "mapbox-gl/dist/mapbox-gl.css";

type VenueType = "GOGO_BAR" | "BEER_BAR" | "GENTLEMENS_CLUB" | "MASSAGE_PARLOR" | "HOTEL" | "RESTAURANT" | "OTHER";

interface Filters {
  venueType: VenueType | "ALL";
  minPlayerScore: number;
  maxPlayerScore: number;
  showGFE: boolean;
  showBBFS: boolean;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

export default function MapPage() {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    venueType: "ALL",
    minPlayerScore: 0,
    maxPlayerScore: 10,
    showGFE: false,
    showBBFS: false,
  });

  const { data: venues, isLoading } = api.venue.getVenuesForMap.useQuery({
    city: "pattaya",
  });

  // Filter venues based on current filters
  const filteredVenues = useMemo(() => {
    if (!venues) return [];

    return venues.filter(venue => {
      // Venue type filter
      if (filters.venueType !== "ALL" && venue.type !== filters.venueType) {
        return false;
      }

      // Player score filter
      if (venue.avgPlayerScore < filters.minPlayerScore || venue.avgPlayerScore > filters.maxPlayerScore) {
        return false;
      }

      // TODO: Add GFE and BBFS filters when we have that data
      // For now, these filters don't affect the results

      return true;
    });
  }, [venues, filters]);

  const getMarkerColor = (score: number) => {
    if (score >= 8.5) return "#4ade80"; // green-400
    if (score < 7.0) return "#f87171"; // red-400
    return "#9ca3af"; // gray-400
  };

  const handleMarkerClick = useCallback((venueId: string) => {
    setSelectedVenue(venueId);
  }, []);

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-400">Loading map data...</div>
        </div>
      </AppShell>
    );
  }

  if (!MAPBOX_TOKEN) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-400">Mapbox token not configured</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="relative h-full">
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            latitude: 12.9236,
            longitude: 100.8825,
            zoom: 13,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
        >
          {filteredVenues.map((venue) => (
            <Marker
              key={venue.id}
              latitude={venue.latitude}
              longitude={venue.longitude}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(venue.id);
              }}
            >
              <div
                className="cursor-pointer transform hover:scale-110 transition-transform"
                style={{ color: getMarkerColor(venue.avgPlayerScore) }}
              >
                <MapPin className="h-6 w-6" fill="currentColor" />
              </div>
            </Marker>
          ))}

          {selectedVenue && (() => {
            const venue = venues?.find(v => v.id === selectedVenue);
            if (!venue) return null;

            return (
              <Popup
                latitude={venue.latitude}
                longitude={venue.longitude}
                onClose={() => setSelectedVenue(null)}
                closeOnClick={false}
                anchor="bottom"
                className="mongermaps-popup"
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-white mb-1">{venue.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {venue.type.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-gray-400">{venue.district}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-sm text-gray-300">Player Score: </span>
                    <span
                      className="font-bold"
                      style={{ color: getMarkerColor(venue.avgPlayerScore) }}
                    >
                      {venue.avgPlayerScore.toFixed(1)}/10
                    </span>
                  </div>
                  <Link href={`/venue/${venue.id}`}>
                    <Button size="sm" className="w-full">
                      View Full Dossier
                    </Button>
                  </Link>
                </div>
              </Popup>
            );
          })()}
        </Map>

        {/* Filter Panel */}
        <Card className="absolute top-4 left-4 w-80 bg-gray-900/95 backdrop-blur border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Intel Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Venue Type Filter */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Venue Type
              </label>
              <Select value={filters.venueType} onValueChange={(value) => setFilters({ ...filters, venueType: value as VenueType | "ALL" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Venues</SelectItem>
                  <SelectItem value="GOGO_BAR">GoGo Bars</SelectItem>
                  <SelectItem value="BEER_BAR">Beer Bars</SelectItem>
                  <SelectItem value="GENTLEMENS_CLUB">Gentlemen's Clubs</SelectItem>
                  <SelectItem value="MASSAGE_PARLOR">Massage Parlors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Player Score Range */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Player Score™ Range: {filters.minPlayerScore} - {filters.maxPlayerScore}
              </label>
              <div className="space-y-2">
                <Slider
                  value={[filters.minPlayerScore, filters.maxPlayerScore]}
                  onValueChange={([min, max]) => setFilters({ ...filters, minPlayerScore: min, maxPlayerScore: max })}
                  min={0}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Tag Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Service Tags
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.showGFE}
                    onCheckedChange={(checked) => setFilters({ ...filters, showGFE: !!checked })}
                  />
                  <span className="text-sm text-gray-300">GFE Available</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.showBBFS}
                    onCheckedChange={(checked) => setFilters({ ...filters, showBBFS: !!checked })}
                  />
                  <span className="text-sm text-gray-300">BBFS Offered</span>
                </label>
              </div>
            </div>

            {/* Results Count */}
            <div className="pt-2 border-t border-gray-800">
              <p className="text-sm text-gray-400">
                Showing {filteredVenues.length} of {venues?.length || 0} venues
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Map Legend */}
        <Card className="absolute bottom-4 right-4 bg-gray-900/95 backdrop-blur border-gray-800">
          <CardContent className="p-3">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Score Legend</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-400" fill="currentColor" />
                <span className="text-xs text-gray-400">Excellent (8.5+)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" fill="currentColor" />
                <span className="text-xs text-gray-400">Average (7.0-8.5)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-400" fill="currentColor" />
                <span className="text-xs text-gray-400">Poor (&lt;7.0)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        .mongermaps-popup .mapboxgl-popup-content {
          background-color: rgb(17 24 39);
          color: white;
          border: 1px solid rgb(31 41 55);
          border-radius: 0.5rem;
          padding: 0;
        }
        .mongermaps-popup .mapboxgl-popup-tip {
          border-top-color: rgb(17 24 39);
        }
      `}</style>
    </AppShell>
  );
}