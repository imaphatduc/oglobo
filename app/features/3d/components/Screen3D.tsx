"use client";

import { Canvas } from "@react-three/fiber";
import { GeoFeature } from "@/app/types";
import { Infographic, Control, useUI } from "../../ui";
import EarthScene from "./EarthScene";
import LoadingScreen from "./LoadingScreen";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface Props {
  features: GeoFeature[];
}

const Screen3D = ({ features: countries }: Props) => {
  const { screenLoaded } = useUI();

  return (
    <div className="">
      {screenLoaded && (
        <div className="absolute top-3 left-3 z-10">
          <Control />
        </div>
      )}

      <PanelGroup direction="horizontal">
        <Panel className="">
          {<LoadingScreen screenLoaded={screenLoaded} />}
          <Canvas>
            <EarthScene countries={countries} />
          </Canvas>
        </Panel>

        <PanelResizeHandle className="w-5 my-auto">
          <div className="w-1 h-8 mx-auto rounded-full bg-neutral-400 hover:bg-neutral-600 focus:bg-neutral-600"></div>
        </PanelResizeHandle>

        <Panel defaultSize={30} minSize={30}>
          <Infographic countries={countries} />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Screen3D;
