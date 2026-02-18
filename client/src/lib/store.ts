import { create } from "zustand";

interface AppState {
  selectedCity: string;
  selectedCategory: string;
  selectedStyle: string;
  selectedVibe: string;
  searchTerm: string;
  favorites: Set<string>;
  visitedCities: string[];
  setSelectedCity: (city: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedStyle: (style: string) => void;
  setSelectedVibe: (vibe: string) => void;
  setSearchTerm: (term: string) => void;
  toggleFavorite: (productId: string) => void;
  clearVisitedCities: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedCity: "Paris",
  selectedCategory: "All",
  selectedStyle: "All",
  selectedVibe: "All",
  searchTerm: "",
  favorites: new Set<string>(),
  visitedCities: ["Paris"],
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
  clearVisitedCities: () => set({ visitedCities: [] }),
}));
