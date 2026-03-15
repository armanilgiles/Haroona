import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { CATEGORIES, VIBES } from "@/lib/mock-data_2";

export function SearchBar() {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedVibe,
    setSelectedVibe,
  } = useAppStore();

  return (
    <div className="px-4 md:px-6 py-4 space-y-3">
      <div className="flex items-center gap-2 max-w-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder='Try: "Parisian Summer"'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-card border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
            data-testid="input-search"
          />
        </div>
        <Button className="rounded-full" data-testid="button-search">
          <Search className="w-4 h-4 mr-1.5" />
          Explore
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Sparkles className="w-3.5 h-3.5 text-[#F0C4A8]" />
          {VIBES.map((vibe) => (
            <Badge
              key={vibe}
              variant={selectedVibe === vibe ? "default" : "secondary"}
              className="cursor-pointer rounded-full"
              onClick={() =>
                setSelectedVibe(selectedVibe === vibe ? "All" : vibe)
              }
              data-testid={`button-vibe-${vibe.toLowerCase().replace(/\s/g, "-")}`}
            >
              {vibe}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer rounded-full text-[11px]"
              onClick={() => setSelectedCategory(cat)}
              data-testid={`button-category-${cat.toLowerCase()}`}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
