import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { CATEGORIES, STYLES, CITIES } from "@/lib/mock-data";

export function MainContent() {
  const { selectedCategory, setSelectedCategory, selectedStyle, setSelectedStyle, setSelectedCity } = useAppStore();
  const featuredCity = CITIES.find((c) => c.id === "marrakech")!;
  const miniCities = CITIES.filter((c) => ["paris", "italy", "tokyo", "london"].includes(c.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.slice(0, 4).map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? "default" : "secondary"}
            className="cursor-pointer rounded-full"
            onClick={() => setSelectedCategory(cat)}
            data-testid={`button-filter-${cat.toLowerCase()}`}
          >
            {cat}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {STYLES.filter((s) => s !== "All" && s !== "Tokyo Streetwear").map((style) => (
          <Badge
            key={style}
            variant={selectedStyle === style ? "default" : "outline"}
            className="cursor-pointer rounded-full"
            onClick={() => setSelectedStyle(style)}
            data-testid={`button-style-filter-${style.toLowerCase().replace(/\s/g, "-")}`}
          >
            {style}
          </Badge>
        ))}
      </div>

      <Card
        className="relative overflow-hidden rounded-xl cursor-pointer group hover-elevate"
        onClick={() => setSelectedCity(featuredCity.name)}
        data-testid="card-featured-city"
      >
        <div className="h-32 md:h-36 relative">
          <img
            src={featuredCity.image}
            alt={featuredCity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <h3 className="text-white font-serif text-lg font-semibold">
              {featuredCity.name}
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-2">
        {miniCities.map((city) => (
          <Card
            key={city.id}
            className="relative overflow-hidden rounded-lg cursor-pointer group hover-elevate"
            onClick={() => setSelectedCity(city.name)}
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
