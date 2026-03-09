"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type PropsWithChildren
} from "react";
import { useRecentList, useStoredSet } from "@/lib/client-storage";

interface AppPreferences {
  favoriteIds: string[];
  recentIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  pushRecent: (id: string) => void;
}

const AppPreferencesContext = createContext<AppPreferences | null>(null);

export function AppProviders({ children }: PropsWithChildren) {
  const favorites = useStoredSet("ds-reference:favorites");
  const recent = useRecentList("ds-reference:recent", 20);

  const isFavorite = useCallback(
    (id: string) => favorites.has(id),
    [favorites]
  );

  const value = useMemo<AppPreferences>(
    () => ({
      favoriteIds: favorites.items,
      recentIds: recent.items,
      isFavorite,
      toggleFavorite: favorites.toggle,
      pushRecent: recent.push
    }),
    [favorites.items, favorites.toggle, isFavorite, recent.items, recent.push]
  );

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences(): AppPreferences {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error("useAppPreferences must be used within <AppProviders>");
  }

  return context;
}
