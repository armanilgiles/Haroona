import { useMemo } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { AppSidebar } from "@/components/app-sidebar";
import { MainContent } from "@/components/main-content";
import { CuratedPicks } from "@/components/curated-picks";
import { GlobeSection } from "@/components/globe-section";
import { Newsletter } from "@/components/newsletter";
import { TrendingCities } from "@/components/trending-cities";
import { StyleInspo } from "@/components/style-inspo";
import { FloatingActionBar } from "@/components/floating-action-bar";
import { TravelModeOverlay } from "@/components/travel-mode-overlay";
import { useAppStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PRODUCTS, RAKUTEN_PRODUCTS_ADAPTED } from "@/lib/mock-data";

export default function Home() {
  const {
    selectedCategory,
    selectedStyle,
    selectedCity,
    selectedVibe,
    searchTerm,
    isRemoteLockEnabled,
  } = useAppStore();

  const { data: apiProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const products =
    apiProducts && apiProducts.length > 0
      ? apiProducts
      : [...PRODUCTS, ...RAKUTEN_PRODUCTS_ADAPTED];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (isRemoteLockEnabled) {
        if (p.cityName.toLowerCase() !== selectedCity.toLowerCase())
          return false;
      }
      if (selectedCategory !== "All" && p.category !== selectedCategory)
        return false;
      if (selectedStyle !== "All" && p.style !== selectedStyle) return false;
      if (selectedVibe !== "All" && p.vibe !== selectedVibe) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.style.toLowerCase().includes(term) ||
          p.cityName.toLowerCase().includes(term) ||
          p.vibe.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [
    products,
    selectedCategory,
    selectedStyle,
    selectedCity,
    selectedVibe,
    searchTerm,
    isRemoteLockEnabled,
  ]);

  const sidebarStyle = {
    "--sidebar-width": "14rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex min-h-screen w-full">
        <AppSidebar products={products as typeof PRODUCTS} />

        <div className="flex flex-col flex-1 min-w-0">
          <NavBar />
          <SearchBar />

          <div className="flex-1 px-4 md:px-6 pb-20 space-y-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <main className="flex-1 min-w-0 space-y-6 lg:max-w-[62%]">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <MainContent />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <CuratedPicks
                    products={filteredProducts as typeof PRODUCTS}
                  />
                </motion.div>
              </main>

              <aside className="w-full lg:w-80 flex-shrink-0 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <GlobeSection />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Newsletter />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                >
                  <StyleInspo />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <TrendingCities />
                </motion.div>
              </aside>
            </div>
          </div>

          <FloatingActionBar />
          <TravelModeOverlay />
        </div>
      </div>
    </SidebarProvider>
  );
}
