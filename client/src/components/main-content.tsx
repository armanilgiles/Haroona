import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { CITIES } from "@/lib/mock-data_2";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export function MainContent() {
  const { selectedCity, setSelectedCity } = useAppStore();
  const { toast } = useToast();

  const [showFloatingCities, setShowFloatingCities] = useState(false);

  const cityStripRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);

  const featuredCity =
    CITIES.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase()) ||
    CITIES[0];

  const otherCities = useMemo(
    () =>
      CITIES.filter(
        (c) => c.name.toLowerCase() !== selectedCity.toLowerCase(),
      ).slice(0, 4),
    [selectedCity],
  );

  const compactCities = useMemo(
    () => [featuredCity, ...otherCities].slice(0, 5),
    [featuredCity, otherCities],
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

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingUp = currentY < lastScrollY.current;
      lastScrollY.current = currentY;

      if (!cityStripRef.current) return;

      const rect = cityStripRef.current.getBoundingClientRect();

      const stripIsOutOfView = rect.bottom < 0;
      setShowFloatingCities(stripIsOutOfView && scrollingUp);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {showFloatingCities && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.22 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-md shadow-sm"
          >
            <div className="px-4 py-2 md:px-6">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {compactCities.map((city, index) => {
                  const isActive = selectedCity === city.name;
                  const isFeatured = index === 0;

                  return (
                    <button
                      key={`floating-city-${city.id}`}
                      onClick={() => handleCitySelect(city.name)}
                      className={`relative shrink-0 overflow-hidden rounded-xl border transition-all ${
                        isFeatured ? "w-[210px] h-[72px]" : "w-[170px] h-[72px]"
                      } ${
                        isActive
                          ? "border-[#D9A77A]/60 ring-1 ring-[#D9A77A]/40"
                          : "border-black/10"
                      }`}
                      data-testid={`floating-city-${city.id}`}
                    >
                      <img
                        src={city.image}
                        alt={city.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      <div className="absolute bottom-2 left-2 text-left">
                        {isFeatured && (
                          <div className="mb-1 inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
                            Currently Exploring
                          </div>
                        )}
                        <p className="text-sm font-semibold text-white">
                          {city.name}
                        </p>
                        {isFeatured && (
                          <p className="text-[10px] text-white/80">
                            {city.country}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={featuredCity.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <Card
              className="relative overflow-hidden rounded-xl group"
              data-testid="card-featured-city"
            >
              <div className="h-36 md:h-44 relative">
                <img
                  src={featuredCity.image}
                  alt={featuredCity.name}
                  className="w-full h-full object-cover"
                  style={{
                    filter: "saturate(0.92) contrast(0.96) brightness(0.97)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                  <div>
                    <Badge
                      variant="secondary"
                      className="text-[10px] rounded-full bg-white/20 backdrop-blur-sm text-white border-none mb-1.5"
                    >
                      Currently Exploring
                    </Badge>
                    <h3 className="text-white font-serif text-xl font-semibold">
                      {featuredCity.name}
                    </h3>
                    <p className="text-white/70 text-xs mt-0.5">
                      {featuredCity.country}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div ref={cityStripRef} className="grid grid-cols-4 gap-2">
          {otherCities.map((city) => (
            <Card
              key={city.id}
              className="relative overflow-hidden rounded-lg cursor-pointer group hover-elevate"
              onClick={() => handleCitySelect(city.name)}
              data-testid={`card-city-${city.id}`}
            >
              <div className="h-16 md:h-20 relative">
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
          ))}
        </div>
      </div>
    </>
  );
}
