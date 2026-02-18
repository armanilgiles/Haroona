import { Heart, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/mock-data";
import { motion } from "framer-motion";

interface CuratedPicksProps {
  products: typeof PRODUCTS;
}

export function CuratedPicks({ products }: CuratedPicksProps) {
  const { selectedCity, setSelectedCity, selectedCategory, setSelectedCategory, selectedStyle, setSelectedStyle } = useAppStore();
  const displayProducts = products.slice(0, 6);
  const hasFilters = selectedCity || selectedCategory !== "All" || selectedStyle !== "All";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="font-serif text-lg font-semibold" data-testid="text-curated-picks">
          Curated Picks
        </h2>
        {hasFilters && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedCity && (
              <Badge variant="secondary" className="text-[10px] rounded-full gap-1">
                {selectedCity}
                <button onClick={() => setSelectedCity(null)} data-testid="button-clear-city">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedCategory !== "All" && (
              <Badge variant="secondary" className="text-[10px] rounded-full gap-1">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("All")} data-testid="button-clear-category">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedStyle !== "All" && (
              <Badge variant="secondary" className="text-[10px] rounded-full gap-1">
                {selectedStyle}
                <button onClick={() => setSelectedStyle("All")} data-testid="button-clear-style">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
      {displayProducts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No products match your filters. Try adjusting your selection.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {displayProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const { favorites, toggleFavorite } = useAppStore();
  const isFav = favorites.has(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className="overflow-hidden group hover-elevate"
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative">
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
            <Badge
              variant="secondary"
              className="text-[10px] bg-white/80 backdrop-blur-sm text-foreground border-none rounded-full px-2"
            >
              {product.cityName}
            </Badge>
            {product.isBestSeller && (
              <Badge
                variant="secondary"
                className="text-[10px] bg-[#F0C4A8]/80 backdrop-blur-sm text-foreground border-none rounded-full px-2"
              >
                Best Seller
              </Badge>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-90"
            data-testid={`button-favorite-${product.id}`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </button>
          <div className="h-40 bg-muted/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="p-3 space-y-0.5">
          <p className="text-sm font-medium" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </p>
          <p className="text-sm font-semibold" data-testid={`text-product-price-${product.id}`}>
            ${product.price.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{product.brand}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
