import { Grid3X3, Flame, Sun, Diamond, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { TRENDING_STYLES, PRODUCTS } from "@/lib/mock-data";
import type { Product } from "@shared/schema";

const ICON_MAP: Record<string, typeof Grid3X3> = {
  grid: Grid3X3,
  flame: Flame,
  sun: Sun,
  diamond: Diamond,
  zap: Zap,
};

interface TrendingSidebarProps {
  products: typeof PRODUCTS;
}

export function TrendingSidebar({ products }: TrendingSidebarProps) {
  const { selectedStyle, setSelectedStyle } = useAppStore();
  const trendingProducts = products.slice(0, 3);

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30">
        <h3 className="font-serif text-base font-semibold mb-3" data-testid="text-trending-title">
          Trending
        </h3>
        <div className="space-y-1">
          {TRENDING_STYLES.map((style) => {
            const Icon = ICON_MAP[style.icon];
            const isActive = selectedStyle === style.name;
            return (
              <button
                key={style.name}
                onClick={() => setSelectedStyle(style.name)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#F0C4A8]/30 text-foreground"
                    : "text-muted-foreground hover:bg-card/80"
                }`}
                data-testid={`button-style-${style.name.toLowerCase().replace(/\s/g, "-")}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{style.name}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-sm font-semibold" data-testid="text-trending-for-you">
            Trending For You
          </h3>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            &gt;
          </button>
        </div>
        <div className="space-y-3">
          {trendingProducts.map((product) => (
            <TrendingProductCard key={product.id} product={product} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function TrendingProductCard({ product }: { product: typeof PRODUCTS[0] }) {
  return (
    <div className="flex items-center gap-3" data-testid={`card-trending-product-${product.id}`}>
      <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{product.brand}</p>
        <p className="text-xs text-muted-foreground truncate">{product.name}</p>
        <p className="text-xs font-semibold">${product.price}</p>
      </div>
      <Button
        variant="default"
        className="rounded-full text-[10px] px-2.5 py-1 h-auto min-h-0 bg-[#F0C4A8] hover:bg-[#E8B494] text-foreground border-[#E8B494] no-default-hover-elevate"
        data-testid={`button-buy-${product.id}`}
      >
        Buy Now
      </Button>
    </div>
  );
}
