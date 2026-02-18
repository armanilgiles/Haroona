import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { CITIES } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export function MainContent() {
  const { selectedCity, setSelectedCity } = useAppStore();
  const { toast } = useToast();

  const featuredCity = CITIES.find(
    (c) => c.name.toLowerCase() === selectedCity.toLowerCase()
  ) || CITIES[0];

  const otherCities = CITIES.filter(
    (c) => c.name.toLowerCase() !== selectedCity.toLowerCase()
  ).slice(0, 4);

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
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                <div>
                  <Badge variant="secondary" className="text-[10px] rounded-full bg-white/20 backdrop-blur-sm text-white border-none mb-1.5">
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

      <div className="grid grid-cols-4 gap-2">
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
  );
}
