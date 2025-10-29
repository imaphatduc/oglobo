"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { useApp } from "@/app/contexts";
import { EarthScene } from "~/3d";
import { Infographic, Control } from "~/gui";
import { LoadingScreen } from "./LoadingScreen";

export const App = () => {
  const { sceneLoaded } = useApp();

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
            <EarthScene />
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
            <Infographic />
          </Panel>
        )}
      </PanelGroup>
    </div>
  );
};
