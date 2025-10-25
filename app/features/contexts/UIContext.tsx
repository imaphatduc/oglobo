"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  selectedCountryIdx?: number;
  setSelectedCountryIdx: (d?: number) => void;
  screenLoaded: boolean;
  setScreenLoaded: (d: boolean) => void;
  showCountryNames: boolean;
  toggleCountryNames: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}

interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [selectedCountryIdx, setSelectedCountryIdx] = useState<number>();

  const [screenLoaded, setScreenLoaded] = useState(false);

  const [showCountryNames, setShowCountryNames] = useState(true);

  const toggleCountryNames = () => {
    setShowCountryNames((prev) => !prev);
  };

  const value = {
    selectedCountryIdx,
    setSelectedCountryIdx,
    screenLoaded,
    setScreenLoaded,
    showCountryNames,
    toggleCountryNames,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
