"use client";

import { createContext, use, useState, ReactNode } from "react";
import { getCountryGeoData } from "../../3d/utils";
import { GeoFeature } from "@/app/types";
import { V3 } from "../../3d/types";

type SelectedCountry = GeoFeature & {
  idx: number;
  centerPoint: V3;
  area: number;
};

interface UIContextType {
  countries: GeoFeature[];
  scaleFactor: number;
  selectedContinent: string;
  setSelectedContinent: (d: string) => void;
  getCountry: (idx: number) => SelectedCountry | undefined;
  selectedCountry: SelectedCountry | undefined;
  selectCountry: (idx?: number) => void;
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
  countries: GeoFeature[];
  scaleFactor: number;
  children: ReactNode;
}

export function UIProvider({
  countries,
  scaleFactor,
  children,
}: UIProviderProps) {
  const [selectedContinent, setSelectedContinent] = useState("");

  const [selectedCountryIdx, setSelectedCountryIdx] = useState<number>();

  const [sceneLoaded, setSceneLoaded] = useState(false);

  const [showCountryNames, setShowCountryNames] = useState(false);

  const getCountry = (idx: number) => {
    const country = countries[idx];

    return country
      ? {
          idx,
          ...country,
          ...getCountryGeoData(country, scaleFactor),
        }
      : undefined;
  };

  const selectCountry = (idx?: number) => {
    if (!idx) {
      setSelectedCountryIdx(undefined);
      return;
    }

    setSelectedCountryIdx(idx);
  };

  const selectedCountry = selectedCountryIdx
    ? getCountry(selectedCountryIdx)
    : undefined;

  const toggleCountryNames = () => {
    setShowCountryNames((prev) => !prev);
  };

  const value = {
    countries,
    scaleFactor,
    selectedContinent,
    setSelectedContinent,
    getCountry,
    selectedCountry,
    selectCountry,
    sceneLoaded,
    setSceneLoaded,
    showCountryNames,
    toggleCountryNames,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
