"use client";

import { Canvas } from "@react-three/fiber";
import { GeoFeature } from "@/app/types";
import Board from "./Board";
import EarthScene from "./EarthScene";
import LoadingScreen from "./LoadingScreen";
import { useUI } from "../../contexts/UIContext";

interface Props {
  features: GeoFeature[];
}

const Screen3D = ({ features: countries }: Props) => {
  const { screenLoaded, selectedCountryIdx } = useUI();

  return (
    <div className="flex justify-between">
      <div className="w-full h-screen relative">
        {<LoadingScreen screenLoaded={screenLoaded} />}
        <Canvas>
          <EarthScene countries={countries} />
        </Canvas>
      </div>
      <div className="w-[30rem] p-3 relative">
        <div className="sticky top-3 bottom-3 bg-neutral-800 text-white w-full h-[calc(100vh-1.5rem)] overflow-auto rounded-md p-8">
          {selectedCountryIdx && countries[selectedCountryIdx] && (
            <Board selectedCountry={countries[selectedCountryIdx]} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Screen3D;
