import { create } from "zustand";

interface AppState {
  selectedCity: string | null;
  selectedCategory: string;
  selectedStyle: string;
  searchTerm: string;
  favorites: Set<string>;
  setSelectedCity: (city: string | null) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedStyle: (style: string) => void;
  setSearchTerm: (term: string) => void;
  toggleFavorite: (productId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedCity: null,
  selectedCategory: "All",
  selectedStyle: "All",
  searchTerm: "",
  favorites: new Set<string>(),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedStyle: (style) => set({ selectedStyle: style }),
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
}));
