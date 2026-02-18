import { useRef, useEffect, useState } from "react";
import createGlobe from "cobe";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, MapPin, RotateCcw, Route, Award, Copy, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CITIES } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const MARKER_LOCATIONS = [
  { location: [48.8566, 2.3522] as [number, number], size: 0.08, name: "Paris" },
  { location: [35.6762, 139.6503] as [number, number], size: 0.08, name: "Tokyo" },
  { location: [51.5074, -0.1278] as [number, number], size: 0.07, name: "London" },
  { location: [40.7128, -74.006] as [number, number], size: 0.08, name: "New York" },
  { location: [41.9028, 12.4964] as [number, number], size: 0.06, name: "Italy" },
  { location: [55.6761, 12.5683] as [number, number], size: 0.06, name: "Copenhagen" },
  { location: [31.6295, -7.9811] as [number, number], size: 0.06, name: "Marrakech" },
];

function GlobeFallback() {
  return (
    <div className="aspect-square max-w-[400px] mx-auto rounded-xl bg-gradient-to-br from-[#F5C5A3]/20 via-[#E8A87C]/10 to-[#8AABCF]/20 flex flex-col items-center justify-center gap-3">
      <Globe className="w-16 h-16 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">Interactive globe</p>
    </div>
  );
}

function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.offsetWidth;
    if (!width || width <= 0) {
      setHasError(true);
      return;
    }

    try {
      globeRef.current = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio, 2),
        width: width * 2,
        height: width * 2,
        phi: 0.3,
        theta: 0.15,
        dark: 0,
        diffuse: 1.8,
        mapSamples: 16000,
        mapBrightness: 4.5,
        baseColor: [1, 0.92, 0.88],
        markerColor: [0.95, 0.75, 0.6],
        glowColor: [1, 0.92, 0.85],
        markers: MARKER_LOCATIONS.map((m) => ({
          location: m.location,
          size: m.size,
        })),
        onRender: (state) => {
          if (!pointerInteracting.current) {
            phiRef.current += 0.003;
          }
          state.phi = phiRef.current + pointerInteractionMovement.current;
          if (canvas.offsetWidth) {
            state.width = canvas.offsetWidth * 2;
            state.height = canvas.offsetWidth * 2;
          }
        },
      });
    } catch {
      setHasError(true);
    }

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, []);

  if (hasError) {
    return <GlobeFallback />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full aspect-square cursor-grab active:cursor-grabbing"
      style={{ maxWidth: "400px", margin: "0 auto", display: "block" }}
      onPointerDown={(e) => {
        pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
      }}
      onPointerUp={() => {
        pointerInteracting.current = null;
      }}
      onPointerOut={() => {
        pointerInteracting.current = null;
      }}
      onPointerMove={(e) => {
        if (pointerInteracting.current !== null) {
          const delta = e.clientX - pointerInteracting.current;
          pointerInteractionMovement.current = delta / 100;
        }
      }}
      data-testid="canvas-globe"
    />
  );
}

function StylePassport() {
  const {
    selectedCity, visitedCities, clearVisitedCities,
    hasShownRouteUnlock, hasShownBadgeUnlock,
    markRouteUnlockShown, markBadgeUnlockShown,
    setTravelMode,
  } = useAppStore();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const maxVisible = 6;
  const visible = visitedCities.slice(0, maxVisible);
  const remaining = visitedCities.length - maxVisible;

  const isRouteUnlocked = visitedCities.length >= 3;
  const isBadgeUnlocked = visitedCities.length >= 7;
  const routeCities = visitedCities.slice(0, 3);

  useEffect(() => {
    if (isRouteUnlocked && !hasShownRouteUnlock) {
      markRouteUnlockShown();
      toast({ title: "Route unlocked", description: "You've explored 3 cities" });
    }
  }, [isRouteUnlocked, hasShownRouteUnlock]);

  useEffect(() => {
    if (isBadgeUnlocked && !hasShownBadgeUnlock) {
      markBadgeUnlockShown();
      toast({ title: "Explorer badge unlocked", description: "You've explored all 7 cities" });
    }
  }, [isBadgeUnlocked, hasShownBadgeUnlock]);

  const handleSharePassport = () => {
    const cities = visitedCities.join(", ");
    const text = `I explored ${visitedCities.length} cities on Aruona: ${cities}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({ title: "Copied to clipboard", description: "Share your journey with friends" });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shouldAnimateCard = (isRouteUnlocked && !hasShownRouteUnlock) || (isBadgeUnlocked && !hasShownBadgeUnlock);

  return (
    <Card
      className={`p-4 bg-card/60 backdrop-blur-sm border-border/30 transition-shadow duration-300 ${
        shouldAnimateCard ? "shadow-[0_0_16px_rgba(240,196,168,0.3)]" : ""
      }`}
      data-testid="card-style-passport"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-sm font-semibold" data-testid="text-style-passport-title">
            Style Passport
          </h3>
          {isBadgeUnlocked && (
            <motion.div
              initial={!hasShownBadgeUnlock ? { opacity: 0, scale: 0.8 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Badge className="text-[9px] rounded-full bg-[#F0C4A8]/20 text-foreground border-[#F0C4A8]/40" data-testid="badge-explorer">
                <Award className="w-2.5 h-2.5 mr-0.5" />
                Aruona Explorer
              </Badge>
            </motion.div>
          )}
        </div>
        {visitedCities.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-[10px] rounded-full"
            onClick={clearVisitedCities}
            data-testid="button-clear-passport"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#F0C4A8]" />
          <span className="text-xs text-muted-foreground">Current Stop:</span>
          <span className="text-xs font-medium" data-testid="text-current-stop">{selectedCity}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Stops Collected:</span>
          <span className="text-xs font-medium" data-testid="text-stops-count">{visitedCities.length}</span>
        </div>
        {visitedCities.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap" data-testid="passport-visited-cities">
            {visible.map((city) => (
              <Badge
                key={city}
                variant={city === selectedCity ? "default" : "secondary"}
                className="text-[10px] rounded-full"
              >
                {city}
              </Badge>
            ))}
            {remaining > 0 && (
              <Badge variant="outline" className="text-[10px] rounded-full">
                +{remaining}
              </Badge>
            )}
          </div>
        )}

        {isRouteUnlocked && (
          <motion.div
            className="pt-2 mt-1 border-t border-border/30 space-y-1.5"
            initial={!hasShownRouteUnlock ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            data-testid="section-route-unlocked"
          >
            <div className="flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-[#F0C4A8]" />
              <span className="text-[11px] font-semibold">Route Unlocked</span>
            </div>
            <p className="text-[10px] text-muted-foreground" data-testid="text-route-path">
              {routeCities.join(" → ")}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[10px] rounded-full gap-1"
              onClick={() => setTravelMode(true)}
              data-testid="button-travel-route"
            >
              <MapPin className="w-3 h-3" />
              Travel this route
            </Button>
          </motion.div>
        )}

        {isBadgeUnlocked && (
          <motion.div
            className="pt-2 mt-1 border-t border-border/30"
            initial={!hasShownBadgeUnlock ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
            data-testid="section-badge-unlocked"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[10px] rounded-full gap-1"
              onClick={handleSharePassport}
              data-testid="button-share-passport"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Share Passport"}
            </Button>
          </motion.div>
        )}
      </div>
    </Card>
  );
}

export function GlobeSection() {
  const { selectedCity, setSelectedCity } = useAppStore();
  const { toast } = useToast();
  const globeCities = CITIES.filter((c) => ["tokyo", "newyork", "paris", "london"].includes(c.id));

  const handleCitySelect = (cityName: string) => {
    if (cityName !== selectedCity) {
      setSelectedCity(cityName);
      toast({
        title: `Now exploring: ${cityName}`,
        description: `Discover curated fashion from ${cityName}`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <GlobeCanvas />
        {MARKER_LOCATIONS.slice(0, 4).map((marker) => {
          const isActive = selectedCity === marker.name;
          const positions: Record<string, string> = {
            "Paris": "top-[25%] right-[15%]",
            "Tokyo": "top-[30%] left-[10%]",
            "London": "top-[20%] right-[30%]",
            "New York": "bottom-[30%] left-[20%]",
          };
          return (
            <motion.button
              key={marker.name}
              className={`absolute ${positions[marker.name]} rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm cursor-pointer transition-colors ${
                isActive
                  ? "bg-[#F0C4A8] text-foreground shadow-[0_0_12px_rgba(240,196,168,0.4)]"
                  : "bg-white/80 backdrop-blur-sm text-foreground/80"
              }`}
              onClick={() => handleCitySelect(marker.name)}
              animate={isActive
                ? { scale: [1, 1.15, 1], transition: { duration: 0.15, ease: "easeOut" } }
                : { scale: 1 }
              }
              data-testid={`button-globe-marker-${marker.name.toLowerCase().replace(/\s/g, "-")}`}
            >
              {marker.name}
            </motion.button>
          );
        })}
      </div>

      <div>
        <h3 className="font-serif text-base font-semibold mb-2" data-testid="text-shop-the-globe">
          Shop the Globe
        </h3>
        <div className="flex items-center gap-2">
          {globeCities.map((city) => {
            const isActive = selectedCity === city.name;
            return (
              <Card
                key={city.id}
                className={`flex-1 relative overflow-hidden rounded-lg cursor-pointer hover-elevate ${
                  isActive ? "ring-2 ring-[#F0C4A8]" : ""
                }`}
                onClick={() => handleCitySelect(city.name)}
                data-testid={`card-globe-city-${city.id}`}
              >
                <div className="h-16 relative">
                  <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <p className="absolute bottom-1.5 left-2 text-white text-[11px] font-medium">
                    {city.name}
                  </p>
                </div>
              </Card>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            data-testid="button-see-all-cities"
          >
            See All
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      <StylePassport />
    </div>
  );
}
