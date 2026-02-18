import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Globe, Compass, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import createGlobe from "cobe";

const MARKER_LOCATIONS = [
  { location: [48.8566, 2.3522] as [number, number], size: 0.08, name: "Paris", country: "France" },
  { location: [35.6762, 139.6503] as [number, number], size: 0.08, name: "Tokyo", country: "Japan" },
  { location: [51.5074, -0.1278] as [number, number], size: 0.07, name: "London", country: "UK" },
  { location: [40.7128, -74.006] as [number, number], size: 0.08, name: "New York", country: "USA" },
  { location: [41.9028, 12.4964] as [number, number], size: 0.06, name: "Italy", country: "Italy" },
  { location: [55.6761, 12.5683] as [number, number], size: 0.06, name: "Copenhagen", country: "Denmark" },
  { location: [31.6295, -7.9811] as [number, number], size: 0.06, name: "Marrakech", country: "Morocco" },
];

function TravelGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initGlobe = () => {
      const width = canvas.offsetWidth;
      if (!width || width <= 0) return;

      try {
        globeRef.current = createGlobe(canvas, {
          devicePixelRatio: Math.min(window.devicePixelRatio, 2),
          width: width * 2,
          height: width * 2,
          phi: 0.3,
          theta: 0.15,
          dark: 0.1,
          diffuse: 2.0,
          mapSamples: 20000,
          mapBrightness: 4.0,
          baseColor: [1, 0.92, 0.88],
          markerColor: [0.95, 0.75, 0.6],
          glowColor: [1, 0.92, 0.85],
          markers: MARKER_LOCATIONS.map((m) => ({
            location: m.location,
            size: m.size,
          })),
          onRender: (state) => {
            if (!pointerInteracting.current) {
              phiRef.current += 0.002;
            }
            state.phi = phiRef.current + pointerInteractionMovement.current;
            if (canvas.offsetWidth) {
              state.width = canvas.offsetWidth * 2;
              state.height = canvas.offsetWidth * 2;
            }
          },
        });
      } catch {
        // silently fail
      }
    };

    const timer = setTimeout(initGlobe, 100);

    return () => {
      clearTimeout(timer);
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full aspect-square cursor-grab active:cursor-grabbing"
      style={{ maxWidth: "600px", margin: "0 auto", display: "block" }}
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
      data-testid="canvas-travel-globe"
    />
  );
}

export function TravelModeOverlay() {
  const { isTravelMode, setTravelMode, selectedCity, setSelectedCity, visitedCities } = useAppStore();
  const { toast } = useToast();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);

  const closeTravelMode = useCallback(() => {
    setTravelMode(false);
    setIsDestinationsOpen(false);
    document.body.style.overflow = "";
  }, [setTravelMode]);

  useEffect(() => {
    if (isTravelMode) {
      document.body.style.overflow = "hidden";
      setTimeout(() => closeButtonRef.current?.focus(), 300);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isTravelMode]);

  useEffect(() => {
    if (!isTravelMode) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTravelMode();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isTravelMode, closeTravelMode]);

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
    <AnimatePresence>
      {isTravelMode && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-label="Travel Mode"
          data-testid="overlay-travel-mode"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={closeTravelMode}
            data-testid="backdrop-travel-mode"
          />

          <div className="relative z-10 flex flex-col w-full h-full pointer-events-none">
            <motion.div
              className="pointer-events-auto mx-auto mt-4 flex items-center gap-4 px-5 py-2.5 rounded-full border border-white/15 bg-card/70 backdrop-blur-xl shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
              data-testid="hud-travel-mode"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#F0C4A8]" />
                <span className="font-serif text-sm font-semibold" data-testid="text-travel-mode-label">Travel Mode</span>
              </div>

              <div className="w-px h-4 bg-border/30" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCity}
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#F0C4A8]" />
                  <span className="text-xs text-muted-foreground hidden sm:inline">Currently exploring:</span>
                  <span className="text-xs font-semibold" data-testid="text-travel-current-city">{selectedCity}</span>
                </motion.div>
              </AnimatePresence>

              <div className="w-px h-4 bg-border/30" />

              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-xs gap-1.5"
                onClick={() => setIsDestinationsOpen(!isDestinationsOpen)}
                data-testid="button-toggle-destinations"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Destinations</span>
              </Button>

              <Button
                ref={closeButtonRef}
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={closeTravelMode}
                aria-label="Close Travel Mode"
                data-testid="button-close-travel-mode"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div
              className="pointer-events-auto flex-1 flex items-center justify-center px-4 py-4 min-h-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
              data-testid="container-travel-stage"
            >
              <div className="relative w-full max-w-[600px]">
                <TravelGlobe />

                {MARKER_LOCATIONS.map((marker) => {
                  const isActive = selectedCity === marker.name;
                  const positions: Record<string, string> = {
                    "Paris": "top-[22%] right-[10%]",
                    "Tokyo": "top-[28%] left-[6%]",
                    "London": "top-[14%] right-[26%]",
                    "New York": "bottom-[26%] left-[14%]",
                    "Italy": "top-[38%] right-[18%]",
                    "Copenhagen": "top-[12%] right-[16%]",
                    "Marrakech": "bottom-[38%] right-[22%]",
                  };
                  if (!positions[marker.name]) return null;
                  return (
                    <motion.button
                      key={marker.name}
                      className={`absolute ${positions[marker.name]} rounded-full px-3 py-1.5 text-xs font-medium shadow-md cursor-pointer transition-colors ${
                        isActive
                          ? "bg-[#F0C4A8] text-foreground shadow-[0_0_16px_rgba(240,196,168,0.6)]"
                          : "bg-white/85 backdrop-blur-sm text-foreground/80"
                      }`}
                      onClick={() => handleCitySelect(marker.name)}
                      whileTap={{ scale: 0.96 }}
                      animate={isActive ? { scale: [1, 1.05, 1], transition: { duration: 0.4 } } : {}}
                      data-testid={`button-travel-marker-${marker.name.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {marker.name}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              className="pointer-events-auto mx-auto mb-6 flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-card/60 backdrop-blur-xl shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
            >
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">
                {visitedCities.length} of {MARKER_LOCATIONS.length} explored
              </span>
              <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#F0C4A8]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(visitedCities.length / MARKER_LOCATIONS.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isDestinationsOpen && (
              <>
                <motion.div
                  className="fixed inset-0 z-[101]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsDestinationsOpen(false)}
                />
                <motion.div
                  className="fixed top-0 right-0 z-[102] h-full w-[340px] max-w-[85vw] border-l border-white/15 bg-card/85 backdrop-blur-xl shadow-2xl flex flex-col"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  data-testid="panel-destinations"
                >
                  <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-border/20">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#F0C4A8]" />
                      <h3 className="font-serif text-sm font-semibold" data-testid="text-destinations-title">Destinations</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setIsDestinationsOpen(false)}
                      aria-label="Close destinations"
                      data-testid="button-close-destinations"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {MARKER_LOCATIONS.map((marker) => {
                      const isActive = selectedCity === marker.name;
                      const isVisited = visitedCities.includes(marker.name);
                      return (
                        <Card
                          key={marker.name}
                          className={`p-3 cursor-pointer transition-colors ${
                            isActive ? "ring-1 ring-[#F0C4A8] bg-[#F0C4A8]/10" : ""
                          }`}
                          onClick={() => handleCitySelect(marker.name)}
                          data-testid={`card-travel-city-${marker.name.toLowerCase().replace(/\s/g, "-")}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <MapPin className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#F0C4A8]" : "text-muted-foreground"}`} />
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{marker.name}</p>
                                <p className="text-[11px] text-muted-foreground">{marker.country}</p>
                              </div>
                            </div>
                            {isVisited && (
                              <Badge variant="secondary" className="text-[9px] rounded-full flex-shrink-0">
                                visited
                              </Badge>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="px-5 py-4 border-t border-border/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {visitedCities.length} of {MARKER_LOCATIONS.length} explored
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[#F0C4A8]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(visitedCities.length / MARKER_LOCATIONS.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
