"use client";

import { Canvas } from "@react-three/fiber";
import { GeoFeature } from "@/app/types";
import { Infographic, Control, useUI } from "../../ui";
import EarthScene from "./EarthScene";
import LoadingScreen from "./LoadingScreen";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState } from "react";
import {
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";

interface Props {
  features: GeoFeature[];
}

const Screen3D = ({ features: countries }: Props) => {
  const { screenLoaded } = useUI();

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [showInfographic, setShowInfographic] = useState(true);

  return (
    <div className="h-screen">
      {screenLoaded && (
        <div className="absolute top-3 left-3 z-10">
          <Control />
        </div>
      )}

      <PanelGroup
        className="relative"
        direction={isMobile ? "vertical" : "horizontal"}
      >
        <Panel className="h-screen relative">
          {!screenLoaded && <LoadingScreen screenLoaded={screenLoaded} />}
          <Canvas>
            <EarthScene countries={countries} />
          </Canvas>
        </Panel>

        <button
          className="sticky z-20 top-8 right-8 w-fit h-fit ml-2 mb-2 md:m-0 p-1 rounded-md hover:bg-neutral-600"
          onClick={() => setShowInfographic(!showInfographic)}
        >
          {isMobile ? (
            showInfographic ? (
              <ChevronsDown />
            ) : (
              <ChevronsUp />
            )
          ) : showInfographic ? (
            <ChevronsRight />
          ) : (
            <ChevronsLeft />
          )}
        </button>

        {showInfographic && (
          <PanelResizeHandle className="w-5 m-auto">
            <div className="h-1 w-8 md:w-1 md:h-8 m-auto rounded-full bg-neutral-400 hover:bg-neutral-600 focus:bg-neutral-600"></div>
          </PanelResizeHandle>
        )}

        {showInfographic && (
          <Panel defaultSize={isMobile ? 35 : 28} minSize={isMobile ? 15 : 28}>
            <Infographic countries={countries} />
          </Panel>
        )}
      </PanelGroup>
    </div>
  );
};

export default Screen3D;
