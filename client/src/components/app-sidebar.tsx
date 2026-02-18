import { Grid3X3, Flame, Sun, Diamond, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAppStore } from "@/lib/store";
import { TRENDING_STYLES, PRODUCTS } from "@/lib/mock-data";

const ICON_MAP: Record<string, typeof Grid3X3> = {
  grid: Grid3X3,
  flame: Flame,
  sun: Sun,
  diamond: Diamond,
  zap: Zap,
};

interface AppSidebarProps {
  products: typeof PRODUCTS;
}

export function AppSidebar({ products }: AppSidebarProps) {
  const { selectedStyle, setSelectedStyle } = useAppStore();
  const trendingProducts = products.slice(0, 3);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-serif text-base font-semibold" data-testid="text-trending-title">
            Trending
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TRENDING_STYLES.map((style) => {
                const Icon = ICON_MAP[style.icon];
                const isActive = selectedStyle === style.name;
                return (
                  <SidebarMenuItem key={style.name}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setSelectedStyle(style.name)}
                      data-testid={`button-style-${style.name.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{style.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-serif text-sm font-semibold" data-testid="text-trending-for-you">
            Trending For You
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 px-2">
              {trendingProducts.map((product) => (
                <TrendingProductCard key={product.id} product={product} />
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
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
        size="sm"
        className="rounded-full text-[10px]"
        data-testid={`button-buy-${product.id}`}
      >
        Buy Now
      </Button>
    </div>
  );
}
