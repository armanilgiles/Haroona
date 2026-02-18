import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Globe, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { CITIES } from "@/lib/mock-data";
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
      style={{ maxWidth: "520px", margin: "0 auto", display: "block" }}
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
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeTravelMode = useCallback(() => {
    if (autoCloseRef.current) {
      clearTimeout(autoCloseRef.current);
      autoCloseRef.current = null;
    }
    setTravelMode(false);
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
    autoCloseRef.current = setTimeout(() => {
      closeTravelMode();
    }, 700);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeTravelMode();
  };

  return (
    <AnimatePresence>
      {isTravelMode && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Travel Mode"
          data-testid="overlay-travel-mode"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <motion.div
            className="relative z-10 w-[90vw] max-w-5xl h-[80vh] max-h-[700px] flex flex-col rounded-2xl border border-white/15 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            data-testid="container-travel-stage"
          >
            <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-border/20">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#F0C4A8]" />
                <span className="font-serif text-sm font-semibold" data-testid="text-travel-mode-label">Travel Mode</span>
              </div>

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
                  <span className="text-xs text-muted-foreground">Currently exploring:</span>
                  <span className="text-xs font-semibold" data-testid="text-travel-current-city">{selectedCity}</span>
                </motion.div>
              </AnimatePresence>

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
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="flex-1 flex items-center justify-center p-4 min-h-0">
                <div className="relative w-full max-w-[520px]">
                  <TravelGlobe />

                  {MARKER_LOCATIONS.slice(0, 4).map((marker) => {
                    const isActive = selectedCity === marker.name;
                    const positions: Record<string, string> = {
                      "Paris": "top-[22%] right-[12%]",
                      "Tokyo": "top-[28%] left-[8%]",
                      "London": "top-[16%] right-[28%]",
                      "New York": "bottom-[28%] left-[16%]",
                    };
                    return (
                      <motion.button
                        key={marker.name}
                        className={`absolute ${positions[marker.name]} rounded-full px-3 py-1.5 text-xs font-medium shadow-md cursor-pointer transition-colors ${
                          isActive
                            ? "bg-[#F0C4A8] text-foreground shadow-[0_0_12px_rgba(240,196,168,0.5)]"
                            : "bg-white/85 backdrop-blur-sm text-foreground/80"
                        }`}
                        onClick={() => handleCitySelect(marker.name)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.96 }}
                        animate={isActive ? { scale: [1, 1.12, 1], transition: { duration: 0.4 } } : {}}
                        data-testid={`button-travel-marker-${marker.name.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        {marker.name}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-border/20 p-4 overflow-y-auto space-y-3">
                <h4 className="font-serif text-sm font-semibold mb-1">Destinations</h4>
                <div className="space-y-1.5">
                  {MARKER_LOCATIONS.map((marker) => {
                    const isActive = selectedCity === marker.name;
                    const isVisited = visitedCities.includes(marker.name);
                    return (
                      <Card
                        key={marker.name}
                        className={`p-2.5 cursor-pointer transition-colors ${
                          isActive ? "ring-1 ring-[#F0C4A8] bg-[#F0C4A8]/10" : ""
                        }`}
                        onClick={() => handleCitySelect(marker.name)}
                        data-testid={`card-travel-city-${marker.name.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-[#F0C4A8]" : "text-muted-foreground"}`} />
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{marker.name}</p>
                              <p className="text-[10px] text-muted-foreground">{marker.country}</p>
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

                <div className="pt-2 border-t border-border/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">
                      {visitedCities.length} of {MARKER_LOCATIONS.length} explored
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[#F0C4A8]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(visitedCities.length / MARKER_LOCATIONS.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
