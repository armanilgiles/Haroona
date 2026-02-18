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
import { PRODUCTS } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  const { selectedCategory, selectedStyle, selectedCity, selectedVibe, searchTerm } = useAppStore();

  const { data: apiProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const products = apiProducts && apiProducts.length > 0 ? apiProducts : PRODUCTS;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.cityName.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
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
  }, [products, selectedCategory, selectedStyle, selectedCity, selectedVibe, searchTerm]);

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
            <div className="relative min-h-[420px] lg:min-h-[480px]">
              <div
                className="
                  relative z-0
                  lg:absolute lg:top-0 lg:right-0 lg:z-10
                  mb-6 lg:mb-0
                "
                style={{
                  /* on lg+, these apply via the absolute positioning */
                }}
              >
                <div
                  className="lg:w-[min(520px,40vw)] lg:translate-x-[20px]"
                >
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="globe-breakout-mask"
                    style={{
                      filter: "drop-shadow(0 0 60px rgba(240,196,168,0.1))",
                    }}
                  >
                    <GlobeSection />
                  </motion.div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <main className="space-y-6 lg:pr-[min(340px,30vw)]">
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
                    <CuratedPicks products={filteredProducts as typeof PRODUCTS} />
                  </motion.div>
                </main>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                </div>
              </div>
            </div>
          </div>

          <FloatingActionBar />
          <TravelModeOverlay />
        </div>
      </div>
    </SidebarProvider>
  );
}
