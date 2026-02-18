import { SlidersHorizontal, Globe, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingActionBar() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border/30 rounded-full px-3 py-2 shadow-lg">
        <Button
          variant="ghost"
          className="rounded-full text-xs gap-1.5"
          data-testid="button-filter"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          data-testid="button-search-bottom"
        >
          <Search className="w-4 h-4" />
        </Button>

        <Button
          className="rounded-full gap-1.5 shadow-[0_0_20px_rgba(240,196,168,0.4)]"
          data-testid="button-explore-map"
        >
          <Globe className="w-4 h-4" />
          Explore Map
        </Button>

        <Button
          variant="ghost"
          className="rounded-full text-xs gap-1.5"
          data-testid="button-sort"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          Sort
        </Button>
      </div>
    </div>
  );
}
