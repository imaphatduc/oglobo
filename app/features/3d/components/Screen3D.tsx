"use client";

import { Canvas } from "@react-three/fiber";
import { GeoFeature } from "@/app/types";
import { useState } from "react";
import Board from "./Board";
import EarthScene from "./EarthScene";
import LoadingScreen from "./LoadingScreen";

interface Props {
  features: GeoFeature[];
}

const Screen3D = ({ features: countries }: Props) => {
  const [selectedCountry, setHoveredCountry] = useState<number>();

  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex justify-between">
      <div className="w-full h-screen relative">
        {<LoadingScreen loaded={loaded} />}
        <Canvas>
          <EarthScene
            screenLoaded={loaded}
            setScreenLoaded={setLoaded}
            countries={countries}
            selectedCountry={
              selectedCountry ? countries[selectedCountry] : undefined
            }
            setHoveredCountry={setHoveredCountry}
          />
        </Canvas>
      </div>
      <div className="w-[30rem] p-3 relative">
        <div className="sticky top-3 bottom-3 bg-neutral-800 text-white w-full h-[calc(100vh-1.5rem)] overflow-auto rounded-md p-8">
          {selectedCountry && countries[selectedCountry] && (
            <Board selectedCountry={countries[selectedCountry]} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Screen3D;
