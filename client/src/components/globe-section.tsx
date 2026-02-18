import { useRef, useEffect, useState } from "react";
import createGlobe from "cobe";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CITIES } from "@/lib/mock-data";

const MARKER_LOCATIONS = [
  { location: [48.8566, 2.3522] as [number, number], size: 0.08, name: "Paris" },
  { location: [35.6762, 139.6503] as [number, number], size: 0.08, name: "Tokyo" },
  { location: [51.5074, -0.1278] as [number, number], size: 0.07, name: "London" },
  { location: [40.7128, -74.006] as [number, number], size: 0.08, name: "New York" },
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

export function GlobeSection() {
  const { setSelectedCity } = useAppStore();
  const globeCities = CITIES.filter((c) => ["tokyo", "newyork"].includes(c.id));

  return (
    <div className="space-y-4">
      <div className="relative">
        <GlobeCanvas />
        <div className="absolute top-[25%] right-[15%] bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm pointer-events-none">
          Paris
        </div>
        <div className="absolute top-[30%] left-[10%] bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm pointer-events-none">
          Tokyo
        </div>
        <div className="absolute top-[20%] right-[30%] bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm pointer-events-none">
          London
        </div>
        <div className="absolute bottom-[30%] left-[20%] bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm pointer-events-none">
          New York
        </div>
      </div>

      <div>
        <h3 className="font-serif text-base font-semibold mb-2" data-testid="text-shop-the-globe">
          Shop the Globe
        </h3>
        <div className="flex items-center gap-2">
          {globeCities.map((city) => (
            <Card
              key={city.id}
              className="flex-1 relative overflow-hidden rounded-lg cursor-pointer hover-elevate"
              onClick={() => setSelectedCity(city.name)}
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
          ))}
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
    </div>
  );
}
