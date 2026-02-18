import { Card } from "@/components/ui/card";
import { CITIES } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export function TrendingCities() {
  const { selectedCity, setSelectedCity } = useAppStore();
  const { toast } = useToast();
  const topCities = [...CITIES]
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 5);

  function formatFollowers(n: number) {
    if (n >= 1000) return `+${Math.floor(n / 1000)}k`;
    return `+${n}`;
  }

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
    <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30">
      <h3 className="font-serif text-sm font-semibold mb-2" data-testid="text-trending-cities">
        Destinations
      </h3>
      <div className="space-y-2">
        {topCities.map((city) => {
          const isActive = selectedCity === city.name;
          return (
            <div
              key={city.id}
              className={`flex items-center justify-between cursor-pointer rounded-md px-2 py-1 transition-colors ${
                isActive ? "bg-[#F0C4A8]/15" : ""
              }`}
              onClick={() => handleCitySelect(city.name)}
              data-testid={`row-trending-city-${city.id}`}
            >
              <span className={`text-xs ${isActive ? "font-semibold" : "font-medium"}`}>{city.name}</span>
              <span className="text-xs text-muted-foreground">{formatFollowers(city.followers)}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
