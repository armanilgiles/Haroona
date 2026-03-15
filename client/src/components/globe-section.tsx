import { useRef, useEffect, useMemo, useState } from "react";
import createGlobe from "cobe";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Globe,
  MapPin,
  RotateCcw,
  Route,
  Award,
  Copy,
  Check,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CITIES } from "@/lib/mock-data_2";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const MARKER_LOCATIONS = [
  {
    location: [48.8566, 2.3522] as [number, number],
    size: 0.08,
    name: "Paris",
  },
  {
    location: [35.6762, 139.6503] as [number, number],
    size: 0.08,
    name: "Tokyo",
  },
  {
    location: [51.5074, -0.1278] as [number, number],
    size: 0.07,
    name: "London",
  },
  {
    location: [40.7128, -74.006] as [number, number],
    size: 0.08,
    name: "New York",
  },
  {
    location: [34.0522, -118.2437] as [number, number],
    size: 0.06,
    name: "Los Angeles",
  },

  {
    location: [55.6761, 12.5683] as [number, number],
    size: 0.06,
    name: "Copenhagen",
  },
  {
    location: [31.6295, -7.9811] as [number, number],
    size: 0.06,
    name: "Marrakech",
  },
  {
    location: [6.5244, 3.3792] as [number, number],
    size: 0.06,
    name: "Lagos",
  },
];

type MarkerPlace = {
  name: string;
  location: [number, number]; // [lat, lon]
  size: number;
};

function degToRad(d: number) {
  return (d * Math.PI) / 180;
}

function shortestLonDeltaDeg(a: number, b: number) {
  // returns in [-180, 180]
  return ((a - b + 540) % 360) - 180;
}

function greatCircleDistanceDeg(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  // Haversine; returns central angle in degrees
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(shortestLonDeltaDeg(lon2, lon1));
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (c * 180) / Math.PI;
}

function locationToAngles(lat: number, long: number): [number, number] {
  // Matches Haroona's CobeCountryGlobe math.
  return [
    Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180,
  ];
}

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
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const [hasError, setHasError] = useState(false);

  const { selectedCity, setSelectedCity } = useAppStore();

  const places = useMemo<MarkerPlace[]>(
    () =>
      MARKER_LOCATIONS.map((m) => ({
        name: m.name,
        location: m.location,
        size: m.size,
      })),
    [],
  );

  // Haroona-style focus + drag model
  const focusRef = useRef<[number, number]>([0, 0]);
  const basePhiRef = useRef(0);
  const baseThetaRef = useRef(0.25);
  const rRef = useRef(0); // drag offset (adds to phi)
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartRRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartThetaRef = useRef(0);
  const clickStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const sizePxRef = useRef(0);
  const dprRef = useRef(1);

  // When the UI changes selectedCity (chips, list, etc.), rotate the globe to it.
  useEffect(() => {
    const match = places.find((p) => p.name === selectedCity);
    if (!match) return;
    focusRef.current = locationToAngles(match.location[0], match.location[1]);
  }, [selectedCity, places]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    dprRef.current = Math.min(1.5, window.devicePixelRatio || 1);

    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    const doublePi = Math.PI * 2;
    const norm = (a: number) => ((a % doublePi) + doublePi) % doublePi;

    const onResize = () => {
      const cssSize = Math.min(
        canvas.offsetWidth || 0,
        canvas.offsetHeight || 0,
      );
      const px = Math.max(1, Math.round(cssSize * dprRef.current));
      sizePxRef.current = px;
    };

    window.addEventListener("resize", onResize);
    onResize();

    const width = sizePxRef.current;
    if (!width || width <= 0) {
      setHasError(true);
      return;
    }

    try {
      globeRef.current = createGlobe(canvas, {
        devicePixelRatio: dprRef.current,
        width: sizePxRef.current,
        height: sizePxRef.current,

        phi: 0,
        theta: baseThetaRef.current,

        // Match Haroona's globe look (clean white, cyan markers)
        dark: 0,
        diffuse: 1.8,
        mapSamples: 16000,
        mapBrightness: 4.5,
        baseColor: [1, 0.92, 0.88],
        markerColor: [0.95, 0.75, 0.6],
        glowColor: [1, 0.92, 0.85],
        markers: places.map((p) => ({ location: p.location, size: p.size })),

        onRender: (state) => {
          let phi = basePhiRef.current;
          let theta = baseThetaRef.current;

          const [focusPhi, focusTheta] = focusRef.current;
          const hasTarget = focusPhi !== 0 || focusTheta !== 0;

          phi = norm(phi);

          // idle spin only when not dragging and not focusing
          if (!draggingRef.current && !hasTarget) {
            phi = norm(phi + 0.003);
          }

          // focus easing only when not dragging
          if (!draggingRef.current && hasTarget) {
            // visible = base + r, so aim base toward (focus - r)
            const targetPhi = norm(focusPhi - rRef.current);

            const distPositive = (targetPhi - phi + doublePi) % doublePi;
            const distNegative = (phi - targetPhi + doublePi) % doublePi;

            if (distPositive < distNegative) {
              phi = norm(phi + distPositive * 0.08);
            } else {
              phi = norm(phi - distNegative * 0.08);
            }

            theta = theta * 0.92 + focusTheta * 0.08;

            // stop focusing when close enough
            const phiDist = Math.min(distPositive, distNegative);
            const thetaDist = Math.abs(focusTheta - theta);
            if (phiDist < 0.002 && thetaDist < 0.002) {
              focusRef.current = [0, 0];
            }
          }

          basePhiRef.current = phi;
          baseThetaRef.current = theta;

          state.phi = phi + rRef.current;
          state.theta = theta;

          const px = sizePxRef.current;
          if (px > 0) {
            state.width = px;
            state.height = px;
          }
        },
      });

      // fade in
      requestAnimationFrame(() => {
        if (canvasRef.current) canvasRef.current.style.opacity = "1";
      });
    } catch {
      setHasError(true);
      return;
    }

    const el = canvas;

    const getLatLonFromClient = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // circle centered in the canvas
      const cx = rect.left + w / 2;
      const cy = rect.top + h / 2;
      const radius = Math.min(w, h) / 2;

      // normalized coordinates in globe circle space
      const xN = (clientX - cx) / radius;
      const yN = -(clientY - cy) / radius; // invert Y (screen down -> math up)
      const r2 = xN * xN + yN * yN;
      if (r2 > 1) return { hit: false as const, xN, yN };

      const zN = Math.sqrt(1 - r2);

      // current visible rotation (matches what you render)
      const phi = basePhiRef.current + rRef.current;
      const theta = baseThetaRef.current;

      // Undo globe rotation: v_globe = Ry(-phi) * Rx(-theta) * v_view
      // Rx(-theta)
      const x = xN;
      const y = yN * Math.cos(-theta) - zN * Math.sin(-theta);
      const z = yN * Math.sin(-theta) + zN * Math.cos(-theta);

      // Ry(-phi)
      const x2 = x * Math.cos(-phi) + z * Math.sin(-phi);
      const y2 = y;
      const z2 = -x * Math.sin(-phi) + z * Math.cos(-phi);

      const lat = Math.asin(Math.max(-1, Math.min(1, y2))) * (180 / Math.PI);
      const lon = -Math.atan2(z2, x2) * (180 / Math.PI);
      return { hit: true as const, xN, yN, lat, lon, phi, theta };
    };

    const onDown = (e: PointerEvent) => {
      // ✅ cancel focus instantly so dragging is always “free” after selecting
      focusRef.current = [0, 0];

      draggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartYRef.current = e.clientY;
      dragStartRRef.current = rRef.current;
      dragStartThetaRef.current = baseThetaRef.current;

      clickStartRef.current = { x: e.clientX, y: e.clientY };
      lastPointerRef.current = { x: e.clientX, y: e.clientY };

      el.style.cursor = "grabbing";
      el.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };

      const dx = e.clientX - dragStartXRef.current;
      const dy = e.clientY - dragStartYRef.current;

      // tilt sensitivity (bigger divisor = slower tilt)
      const thetaDivisor = 260;
      const THETA_MIN = -1.1;
      const THETA_MAX = 1.1;

      baseThetaRef.current = clamp(
        dragStartThetaRef.current + dy / thetaDivisor,
        THETA_MIN,
        THETA_MAX,
      );

      const mobileBoost =
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches
          ? 1.8
          : 1;

      // ✅ sensitivity (smaller = more sensitive)
      const divisor = 120;
      rRef.current = dragStartRRef.current + (dx / divisor) * mobileBoost;
    };

    const onUp = () => {
      draggingRef.current = false;
      el.style.cursor = "grab";

      const start = clickStartRef.current;
      const end = lastPointerRef.current;
      clickStartRef.current = null;
      lastPointerRef.current = null;
      if (!start || !end) return;

      // if pointer didn't move much, treat as a click/tap
      const dist = Math.hypot(end.x - start.x, end.y - start.y);
      const CLICK_RADIUS_PX = 12;
      if (dist > CLICK_RADIUS_PX) return;

      const res = getLatLonFromClient(end.x, end.y);
      if (!res.hit) return;

      // marker picking: choose nearest place within a reasonable threshold
      let best: { place: MarkerPlace; distDeg: number } | null = null;
      for (const p of places) {
        const d = greatCircleDistanceDeg(
          res.lat,
          res.lon,
          p.location[0],
          p.location[1],
        );
        if (!best || d < best.distDeg) best = { place: p, distDeg: d };
      }

      const MARKER_PICK_MAX_DEG = 10;
      if (best && best.distDeg <= MARKER_PICK_MAX_DEG) {
        focusRef.current = locationToAngles(
          best.place.location[0],
          best.place.location[1],
        );
        setSelectedCity(best.place.name);
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, [places, setSelectedCity]);

  if (hasError) {
    return <GlobeFallback />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full aspect-square"
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        display: "block",
        cursor: "grab",
        touchAction: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        opacity: 0,
        transition: "opacity 250ms ease",
      }}
      data-testid="canvas-globe"
    />
  );
}

function StylePassport() {
  const {
    selectedCity,
    visitedCities,
    clearVisitedCities,
    hasShownRouteUnlock,
    hasShownBadgeUnlock,
    markRouteUnlockShown,
    markBadgeUnlockShown,
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
      toast({
        title: "Style route unlocked",
        description: "You've collected 3 style stops",
      });
    }
  }, [isRouteUnlocked, hasShownRouteUnlock]);

  useEffect(() => {
    if (isBadgeUnlocked && !hasShownBadgeUnlock) {
      markBadgeUnlockShown();
      toast({
        title: "Explorer badge unlocked",
        description: "You've collected all style stops",
      });
    }
  }, [isBadgeUnlocked, hasShownBadgeUnlock]);

  const handleSharePassport = () => {
    const cities = visitedCities.join(", ");
    const text = `My Haroona style stops: ${cities}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Share your journey with friends",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shouldAnimateCard =
    (isRouteUnlocked && !hasShownRouteUnlock) ||
    (isBadgeUnlocked && !hasShownBadgeUnlock);

  return (
    <Card
      className={`p-4 bg-card/60 backdrop-blur-sm border-border/30 transition-shadow duration-300 ${
        shouldAnimateCard ? "shadow-[0_0_16px_rgba(240,196,168,0.3)]" : ""
      }`}
      data-testid="card-style-passport"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div>
            <h3
              className="font-serif text-sm font-semibold"
              data-testid="text-style-passport-title"
            >
              Style Passport
            </h3>
            <p className="text-[10px] text-muted-foreground/60">
              Collect style stops as you explore the globe.
            </p>
          </div>
          {isBadgeUnlocked && (
            <motion.div
              initial={
                !hasShownBadgeUnlock ? { opacity: 0, scale: 0.8 } : false
              }
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Badge
                className="text-[9px] rounded-full bg-[#F0C4A8]/20 text-foreground border-[#F0C4A8]/40"
                data-testid="badge-explorer"
              >
                <Award className="w-2.5 h-2.5 mr-0.5" />
                Haroona Explorer
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
            Reset
          </Button>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#F0C4A8]" />
          <span className="text-xs text-muted-foreground">
            Current Style Stop:
          </span>
          <span className="text-xs font-medium" data-testid="text-current-stop">
            {selectedCity}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Stops Collected:
          </span>
          <span className="text-xs font-medium" data-testid="text-stops-count">
            {visitedCities.length}
          </span>
        </div>
        {visitedCities.length > 0 && (
          <div
            className="flex items-center gap-1 flex-wrap"
            data-testid="passport-visited-cities"
          >
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
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Route className="w-3.5 h-3.5 text-[#F0C4A8]" />
                <span className="text-[11px] font-semibold">
                  Style Route Unlocked
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground/70">
                A curated path through your style stops.
              </p>
            </div>
            <p
              className="text-[10px] text-muted-foreground"
              data-testid="text-route-path"
            >
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
              Explore this route
            </Button>
          </motion.div>
        )}

        {isBadgeUnlocked && (
          <motion.div
            className="pt-2 mt-1 border-t border-border/30 space-y-1.5"
            initial={!hasShownBadgeUnlock ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
            data-testid="section-badge-unlocked"
          >
            <p className="text-[10px] text-muted-foreground/70">
              Collected all style stops.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[10px] rounded-full gap-1"
              onClick={handleSharePassport}
              data-testid="button-share-passport"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copied ? "Copied" : "Share Style Passport"}
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
  const globeCities = CITIES.filter((c) =>
    ["tokyo", "newyork", "paris", "london", "lagos"].includes(c.id),
  );

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
            Paris: "top-[25%] right-[15%]",
            Tokyo: "top-[30%] left-[10%]",
            London: "top-[20%] right-[30%]",
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
              animate={
                isActive
                  ? {
                      scale: [1, 1.15, 1],
                      transition: { duration: 0.15, ease: "easeOut" },
                    }
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
        <h3
          className="font-serif text-base font-semibold mb-2"
          data-testid="text-shop-the-globe"
        >
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
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
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
