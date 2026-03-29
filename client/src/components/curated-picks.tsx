import { Heart, X, Globe, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/mock-data_2";
import { motion, AnimatePresence } from "framer-motion";

interface CuratedPicksProps {
  products: typeof PRODUCTS;
}

function RemoteSignal() {
  const { selectedCity, isRemoteLockEnabled, toggleRemoteLock } = useAppStore();

  return (
    <div
      className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-2.5 rounded-md bg-card/80 dark:bg-card/60 backdrop-blur-md border border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      data-testid="bar-remote-signal"
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-full bg-[#F0C4A8]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Globe className="w-3.5 h-3.5 text-[#F0C4A8]" />
        </div>

        <div className="min-w-0" data-testid="text-remote-signal">
          <div className="text-xs truncate">
            {isRemoteLockEnabled ? (
              <>
                <span className="font-semibold text-foreground/70">
                  Viewing
                </span>{" "}
                <span className="font-medium text-foreground">
                  {selectedCity}
                </span>{" "}
                <span className="font-semibold text-foreground/70">only</span>
              </>
            ) : (
              <span className="font-medium text-foreground">
                Browsing all cities
              </span>
            )}
          </div>

          <div className="hidden sm:block text-[11px] text-muted-foreground/70 truncate">
            {isRemoteLockEnabled
              ? "Products are narrowed to this city"
              : 'Turn on "Narrow to city" to focus results'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden sm:block w-px h-4 bg-border/60" />
        <button
          onClick={toggleRemoteLock}
          className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
            isRemoteLockEnabled
              ? "bg-[#F0C4A8]/15 text-foreground"
              : "bg-transparent text-muted-foreground"
          }`}
          data-testid="button-toggle-remote-lock"
          aria-pressed={isRemoteLockEnabled}
          title={
            isRemoteLockEnabled
              ? "Narrow to city is on"
              : "Narrow to city is off"
          }
        >
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="hidden sm:inline">Narrow to city</span>
          <span
            className={`w-7 h-4 rounded-full relative transition-colors ${
              isRemoteLockEnabled ? "bg-[#F0C4A8]" : "bg-muted-foreground/25"
            }`}
          >
            <span
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${
                isRemoteLockEnabled ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  );
}
function EmptyGateState() {
  const { setTravelMode } = useAppStore();

  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center space-y-3"
      data-testid="container-empty-gate"
    >
      <Globe className="w-10 h-10 text-muted-foreground/30" />
      <div className="space-y-1">
        <p
          className="text-sm font-medium text-foreground"
          data-testid="text-gate-title"
        >
          Pick a city to begin
        </p>
        <p
          className="text-xs text-muted-foreground"
          data-testid="text-gate-subtitle"
        >
          The globe controls what you see.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full gap-1.5 mt-1"
        onClick={() => setTravelMode(true)}
        data-testid="button-gate-select-destination"
      >
        <MapPin className="w-3.5 h-3.5" />
        Select Destination
      </Button>
    </div>
  );
}

export function CuratedPicks({ products }: CuratedPicksProps) {
  const {
    selectedCity,
    selectedCategory,
    setSelectedCategory,
    selectedStyle,
    setSelectedStyle,
    selectedVibe,
    setSelectedVibe,
    isRemoteLockEnabled,
  } = useAppStore();

  const displayProducts = products.slice(0, 6);
  const hasFilters =
    selectedCategory !== "All" ||
    selectedStyle !== "All" ||
    selectedVibe !== "All";

  return (
    <div className="space-y-3">
      {/* Use Later  */}
      {/* <RemoteSignal /> */}

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <h2
            className="font-serif text-lg font-semibold"
            data-testid="text-curated-picks"
          >
            Curated Picks
          </h2>

          {isRemoteLockEnabled && (
            <Badge
              variant="outline"
              className="text-[10px] rounded-full"
              data-testid="badge-city-filter"
            >
              {selectedCity}
            </Badge>
          )}
        </div>

        {hasFilters && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedCategory !== "All" && (
              <Badge
                variant="secondary"
                className="text-[10px] rounded-full gap-1"
              >
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("All")}
                  data-testid="button-clear-category"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {selectedStyle !== "All" && (
              <Badge
                variant="secondary"
                className="text-[10px] rounded-full gap-1"
              >
                {selectedStyle}
                <button
                  onClick={() => setSelectedStyle("All")}
                  data-testid="button-clear-style"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}

            {selectedVibe !== "All" && (
              <Badge
                variant="secondary"
                className="text-[10px] rounded-full gap-1"
              >
                {selectedVibe}
                <button
                  onClick={() => setSelectedVibe("All")}
                  data-testid="button-clear-vibe"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCity}-${selectedCategory}-${selectedVibe}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {displayProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No discoveries match your journey. Try a different stop or vibe.
            </div>
          ) : (
            // <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {displayProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: (typeof PRODUCTS)[0];
  index: number;
}) {
  const { favorites, toggleFavorite } = useAppStore();
  const isFav = favorites.has(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card
        className="overflow-hidden rounded-xl border bg-card shadow-none"
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative">
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
            <Badge
              variant="secondary"
              className="h-5 text-[8px] px-1.5 rounded-full bg-white/90 text-foreground border-none"
            >
              {product.cityName}
            </Badge>

            {product.isBestSeller && (
              <Badge
                variant="secondary"
                className="h-5 text-[8px] px-1.5 rounded-full bg-[#F0C4A8]/90 text-foreground border-none"
              >
                Best Seller
              </Badge>
            )}
          </div>
          {/* //Use Later */}
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center"
            data-testid={`button-favorite-${product.id}`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </button> */}

          <div className="aspect-[3/4] bg-muted/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="px-2 py-2 space-y-1">
          <p
            className="text-sm leading-4 font-medium line-clamp-2"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </p>

          <p
            className="text-base leading-tight font-semibold"
            data-testid={`text-product-price-${product.id}`}
          >
            ${product.price.toLocaleString()}
          </p>

          <div className="flex items-center gap-1.5 min-w-0">
            <Badge
              variant="outline"
              className="h-4 text-[7px] px-1.5 rounded-full no-default-hover-elevate no-default-active-elevate"
            >
              {product.vibe}
            </Badge>
            <p className="text-[10px] text-muted-foreground truncate">
              {product.brand}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
