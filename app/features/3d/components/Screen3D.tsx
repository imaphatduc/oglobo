"use client";

import { Canvas } from "@react-three/fiber";
import { GeoFeature } from "@/app/types";
import { Panel, useUI } from "../../ui";
import EarthScene from "./EarthScene";
import LoadingScreen from "./LoadingScreen";

interface Props {
  features: GeoFeature[];
}

const Screen3D = ({ features: countries }: Props) => {
  const { screenLoaded } = useUI();

  return (
    <div className="flex justify-between">
      <div className="w-full h-screen relative">
        {<LoadingScreen screenLoaded={screenLoaded} />}
        <Canvas>
          <EarthScene countries={countries} />
        </Canvas>
      </div>
      <Panel countries={countries} />
    </div>
  );
};

export default Screen3D;
