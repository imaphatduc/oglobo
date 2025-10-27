"use client";

import { Canvas } from "@react-three/fiber";
import { GeoFeature } from "@/app/types";
import { Infographic, Control, useUI } from "../features/ui";
import { EarthScene } from "../features/3d";
import LoadingScreen from "./LoadingScreen";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, useState } from "react";
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

const App = ({ features: countries }: Props) => {
  const { sceneLoaded } = useUI();

  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [showInfographic, setShowInfographic] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-screen">
      {sceneLoaded && (
        <div className="absolute top-0 left-0 z-10">
          <Control />
        </div>
      )}

      <PanelGroup
        className="relative"
        direction={isMobile ? "vertical" : "horizontal"}
      >
        <Panel className="h-screen relative">
          <LoadingScreen sceneLoaded={sceneLoaded} />
          <Canvas>
            <EarthScene countries={countries} />
          </Canvas>
        </Panel>

        <button
          className="sticky z-20 top-8 right-8 w-fit h-fit m-2 md:ml-2 p-1 rounded-md hover:bg-neutral-600"
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

export default App;
