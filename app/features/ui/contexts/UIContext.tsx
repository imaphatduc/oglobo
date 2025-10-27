"use client";

import { createContext, use, useState, ReactNode } from "react";

interface UIContextType {
  selectedContinent: string;
  setSelectedContinent: (d: string) => void;
  selectedCountryIdx?: number;
  setSelectedCountryIdx: (d?: number) => void;
  sceneLoaded: boolean;
  setSceneLoaded: (d: boolean) => void;
  showCountryNames: boolean;
  toggleCountryNames: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function useUI() {
  const context = use(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}

interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [selectedContinent, setSelectedContinent] = useState("");

  const [selectedCountryIdx, setSelectedCountryIdx] = useState<number>();

  const [sceneLoaded, setSceneLoaded] = useState(false);

  const [showCountryNames, setShowCountryNames] = useState(false);

  const toggleCountryNames = () => {
    setShowCountryNames((prev) => !prev);
  };

  const value = {
    selectedContinent,
    setSelectedContinent,
    selectedCountryIdx,
    setSelectedCountryIdx,
    sceneLoaded,
    setSceneLoaded,
    showCountryNames,
    toggleCountryNames,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
