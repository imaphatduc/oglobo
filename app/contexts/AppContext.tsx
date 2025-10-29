"use client";

import { createContext, use, useState, ReactNode } from "react";
import { GeoFeature } from "@/data";
import { DatasetKey } from "~/dataset";

type SelectedCountry = GeoFeature & {
  idx: number;
};

interface AppContextType {
  countries: GeoFeature[];
  globeRadius: number;
  selectedContinent: string;
  setSelectedContinent: (d: string) => void;
  getCountry: (idx: number) => SelectedCountry | undefined;
  selectedCountry: SelectedCountry | undefined;
  selectCountry: (idx?: number) => void;
  sceneLoaded: boolean;
  setSceneLoaded: (d: boolean) => void;
  showCountryNames: boolean;
  toggleCountryNames: () => void;
  datasetKey: DatasetKey | "";
  setDatasetKey: (d: DatasetKey | "") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = use(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

interface AppProviderProps {
  countries: GeoFeature[];
  globeRadius: number;
  children: ReactNode;
}

export function AppProvider({
  countries,
  globeRadius,
  children,
}: AppProviderProps) {
  const [selectedContinent, setSelectedContinent] = useState("");

  const [selectedCountryIdx, setSelectedCountryIdx] = useState<number>();

  const [sceneLoaded, setSceneLoaded] = useState(false);

  const [showCountryNames, setShowCountryNames] = useState(false);

  const [datasetKey, setDatasetKey] = useState<DatasetKey | "">("");

  const getCountry = (idx: number) => {
    const country = countries[idx];

    return country
      ? {
          idx,
          ...country,
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
    globeRadius,
    selectedContinent,
    setSelectedContinent,
    getCountry,
    selectedCountry,
    selectCountry,
    sceneLoaded,
    setSceneLoaded,
    showCountryNames,
    toggleCountryNames,
    datasetKey,
    setDatasetKey,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
