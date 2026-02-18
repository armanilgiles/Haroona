import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  selectedCity: string;
  selectedCategory: string;
  selectedStyle: string;
  selectedVibe: string;
  searchTerm: string;
  favorites: Set<string>;
  visitedCities: string[];
  isTravelMode: boolean;
  isRemoteLockEnabled: boolean;
  setSelectedCity: (city: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedStyle: (style: string) => void;
  setSelectedVibe: (vibe: string) => void;
  setSearchTerm: (term: string) => void;
  toggleFavorite: (productId: string) => void;
  clearVisitedCities: () => void;
  toggleTravelMode: () => void;
  setTravelMode: (value: boolean) => void;
  toggleRemoteLock: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedCity: "Paris",
      selectedCategory: "All",
      selectedStyle: "All",
      selectedVibe: "All",
      searchTerm: "",
      favorites: new Set<string>(),
      visitedCities: [],
      isTravelMode: false,
      isRemoteLockEnabled: true,
      setSelectedCity: (city) =>
        set((state) => {
          const visited = state.visitedCities.includes(city)
            ? state.visitedCities
            : [...state.visitedCities, city];
          return { selectedCity: city, visitedCities: visited };
        }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedStyle: (style) => set({ selectedStyle: style }),
      setSelectedVibe: (vibe) => set({ selectedVibe: vibe }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      toggleFavorite: (productId) =>
        set((state) => {
          const newFavorites = new Set(state.favorites);
          if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
          } else {
            newFavorites.add(productId);
          }
          return { favorites: newFavorites };
        }),
      clearVisitedCities: () => set({ visitedCities: [], selectedCity: "Paris" }),
      toggleTravelMode: () => set((state) => ({ isTravelMode: !state.isTravelMode })),
      setTravelMode: (value) => set({ isTravelMode: value }),
      toggleRemoteLock: () => set((state) => ({ isRemoteLockEnabled: !state.isRemoteLockEnabled })),
    }),
    {
      name: "aruona-store",
      partialize: (state) => ({
        selectedCity: state.selectedCity,
        selectedCategory: state.selectedCategory,
        selectedVibe: state.selectedVibe,
        visitedCities: state.visitedCities,
        isRemoteLockEnabled: state.isRemoteLockEnabled,
      }),
    }
  )
);
