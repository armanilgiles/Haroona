import { Card } from "@/components/ui/card";
import { CITIES } from "@/lib/mock-data";

export function TrendingCities() {
  const topCities = CITIES
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 3);

  function formatFollowers(n: number) {
    if (n >= 1000) return `+${Math.floor(n / 1000)}k`;
    return `+${n}`;
  }

  return (
    <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30">
      <h3 className="font-serif text-sm font-semibold mb-2" data-testid="text-trending-cities">
        Trending
      </h3>
      <div className="space-y-2">
        {topCities.map((city) => (
          <div
            key={city.id}
            className="flex items-center justify-between"
            data-testid={`row-trending-city-${city.id}`}
          >
            <span className="text-xs font-medium">{city.name}</span>
            <span className="text-xs text-muted-foreground">{formatFollowers(city.followers)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
