"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Shell } from "~/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
import { PaywallModal } from "~/components/paywall-modal";
import { MapPin, Route, Lock, Filter } from "lucide-react";
import { api } from "~/trpc/react";
import { env } from "~/env";

// Initialize Mapbox
if (env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
}

export default function MapPage() {
  const { data: session } = useSession();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  const [showPaywall, setShowPaywall] = useState(false);
  const [venueType, setVenueType] = useState("");
  const [district, setDistrict] = useState("");
  const [scoreRange, setScoreRange] = useState([8.0]);
  const [priceRange, setPriceRange] = useState([1500]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showVeteranPath, setShowVeteranPath] = useState(false);
  
  const isPaid = session?.user?.isPaid;
  const tags = ["GFE", "BBFS", "Starfish", "BBBJ", "CIM", "COF"];
  
  // Fetch venues data
  const { data: venues, isLoading } = api.intelligence.getVenues.useQuery(
    {
      city: "pattaya",
      filters: {
        minVibeScore: scoreRange[0],
        maxPrice: priceRange[0],
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        venueType: venueType ? [venueType.toUpperCase()] : undefined,
      },
    },
    {
      enabled: !!isPaid,
    }
  );
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [100.8782, 12.9236], // Pattaya coordinates
      zoom: 13,
    });
    
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    
    return () => {
      map.current?.remove();
    };
  }, []);
  
  // Update markers when venues data changes
  useEffect(() => {
    if (!map.current || !venues || !isPaid) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add new markers
    venues.forEach(venue => {
      // Determine marker color based on vibe score
      let color = "#ef4444"; // red
      if (venue.vibeScore >= 8) color = "#22c55e"; // green
      else if (venue.vibeScore >= 6) color = "#eab308"; // yellow
      
      const el = document.createElement("div");
      el.className = "marker";
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.backgroundColor = color;
      el.style.borderRadius = "50%";
      el.style.border = "2px solid white";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([venue.coordinates.lng, venue.coordinates.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-3">
              <h3 class="font-bold text-lg mb-2">${venue.name}</h3>
              <div class="space-y-1">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Vibe Score:</span>
                  <span class="font-semibold">${venue.vibeScore.toFixed(1)}</span>
                </div>
                ${venue.avgPriceST ? `
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Avg Price (ST):</span>
                    <span class="font-semibold">${Math.round(venue.avgPriceST)} THB</span>
                  </div>
                ` : ""}
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Reports:</span>
                  <span class="font-semibold">${venue.reportCount}</span>
                </div>
              </div>
              <button onclick="window.location.href='/venue/${venue.id}'" class="mt-3 w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                View Details
              </button>
            </div>
          `)
        )
        .addTo(map.current);
      
      markers.current.push(marker);
    });
  }, [venues, isPaid]);
  
  // Handle filter changes
  const handleFilterChange = () => {
    if (!isPaid) {
      setShowPaywall(true);
    }
  };

  return (
    <Shell>
      <div className="relative h-full">
        {/* Filter Panel */}
        <Card className="absolute top-4 left-4 w-80 z-10 max-h-[calc(100vh-120px)] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {!isPaid && (
                <Badge variant="secondary" className="ml-auto">
                  <Lock className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Veteran's Path toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="veteran-path" className="text-sm font-medium flex items-center gap-2">
                <Route className="h-4 w-4" />
                Show Veteran's Path
              </Label>
              <Switch 
                id="veteran-path" 
                checked={showVeteranPath} 
                onCheckedChange={(checked) => {
                  if (!isPaid) {
                    setShowPaywall(true);
                  } else {
                    setShowVeteranPath(checked);
                  }
                }}
                disabled={!isPaid}
              />
            </div>

            <div className={!isPaid ? "opacity-50" : ""}>
              <Label className="text-sm font-medium">Venue Type</Label>
              <Select 
                value={venueType} 
                onValueChange={(value) => {
                  handleFilterChange();
                  if (isPaid) setVenueType(value);
                }}
                disabled={!isPaid}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="gogo_bar">Go-Go Bar</SelectItem>
                  <SelectItem value="beer_bar">Beer Bar</SelectItem>
                  <SelectItem value="gentlemens_club">Gentlemen's Club</SelectItem>
                  <SelectItem value="massage_parlor">Massage Parlor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={!isPaid ? "opacity-50" : ""}>
              <Label className="text-sm font-medium">District</Label>
              <Select 
                value={district} 
                onValueChange={(value) => {
                  handleFilterChange();
                  if (isPaid) setDistrict(value);
                }}
                disabled={!isPaid}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All districts</SelectItem>
                  <SelectItem value="walking-street">Walking Street</SelectItem>
                  <SelectItem value="soi-6">Soi 6</SelectItem>
                  <SelectItem value="lk-metro">LK Metro</SelectItem>
                  <SelectItem value="soi-buakhao">Soi Buakhao</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={!isPaid ? "opacity-50" : ""}>
              <Label className="text-sm font-medium">Vibe Score™ Range</Label>
              <div className="px-2 py-4">
                <Slider
                  value={scoreRange}
                  onValueChange={(value) => {
                    handleFilterChange();
                    if (isPaid) setScoreRange(value);
                  }}
                  max={10}
                  min={1}
                  step={0.1}
                  className="w-full"
                  disabled={!isPaid}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1.0</span>
                  <span className="font-medium">{scoreRange[0]?.toFixed(1)}</span>
                  <span>10.0</span>
                </div>
              </div>
            </div>

            <div className={!isPaid ? "opacity-50" : ""}>
              <Label className="text-sm font-medium">Price Range (THB)</Label>
              <div className="px-2 py-4">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => {
                    handleFilterChange();
                    if (isPaid) setPriceRange(value);
                  }}
                  max={5000}
                  min={500}
                  step={100}
                  className="w-full"
                  disabled={!isPaid}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>500</span>
                  <span className="font-medium">{priceRange[0]}</span>
                  <span>5000</span>
                </div>
              </div>
            </div>

            <div className={!isPaid ? "opacity-50" : ""}>
              <Label className="text-sm font-medium mb-3 block">Tags</Label>
              <div className="grid grid-cols-2 gap-2">
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={(checked) => {
                        handleFilterChange();
                        if (isPaid) {
                          if (checked) {
                            setSelectedTags([...selectedTags, tag]);
                          } else {
                            setSelectedTags(selectedTags.filter((t) => t !== tag));
                          }
                        }
                      }}
                      disabled={!isPaid}
                    />
                    <Label htmlFor={tag} className="text-sm cursor-pointer">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {isPaid ? (
              <Button 
                className="w-full bg-transparent" 
                variant="outline"
                onClick={() => {
                  setVenueType("");
                  setDistrict("");
                  setScoreRange([8.0]);
                  setPriceRange([1500]);
                  setSelectedTags([]);
                  setShowVeteranPath(false);
                }}
              >
                Reset Filters
              </Button>
            ) : (
              <Button 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                onClick={() => setShowPaywall(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Unlock All Filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Map Container */}
        <div ref={mapContainer} className="h-full w-full">
          {!env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN && (
            <div className="h-full bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Map Configuration Required</h3>
                <p className="text-muted-foreground">
                  Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Show sample venues for non-paid users */}
        {!isPaid && map.current && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <Card className="bg-black/80 backdrop-blur">
              <CardContent className="p-4">
                <p className="text-sm text-center">
                  <Lock className="inline h-4 w-4 mr-2 text-yellow-500" />
                  Showing sample venues only. 
                  <Button
                    variant="link"
                    className="text-yellow-500 p-0 ml-1"
                    onClick={() => setShowPaywall(true)}
                  >
                    Unlock all {venues?.length || "200+"} venues
                  </Button>
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="interactive map with all venues"
      />
    </Shell>
  );
}