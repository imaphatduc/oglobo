"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GeoFeature } from "@/app/types";
import Globe from "./Globe";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CountryBorder from "./CountryBorder";
import { Clock, Color, Points, Raycaster, Vector2, Vector3 } from "three";
import { toGeoCoords, toGlobeCoords } from "../utils";
import CountryMesh from "./CountryMesh";
import { Easing, Group, Tween } from "@tweenjs/tween.js";
import Starfield from "./Starfield";
import { useUI } from "../../ui";
import { useSearchParams } from "next/navigation";
import { booleanPointInPolygon } from "@turf/turf";
import { getRaycastPoint } from "../utils/getRaycastPoint";
import Countries from "./Countries";

interface Props {
  countries: GeoFeature[];
}

const EarthScene = ({ countries }: Props) => {
  const {
    selectedContinent,
    sceneLoaded,
    setSceneLoaded,
    setSelectedCountryIdx,
  } = useUI();

  const scaleFactor = 2.5;

  const globeRef = useRef(null);

  const { camera, pointer } = useThree();

  const searchParams = useSearchParams();

  const controlsRef = useRef<any>(null);

  const raycaster = new Raycaster();

  const group = new Group();

  const numStars = 2000;

  const starfieldRef = useRef<Points>(null);

  ///////////////////////////////
  /// EARTH NAVIGATION CONTROL
  ///////////////////////////////

  const saveLocationWhileNavigating = useCallback(() => {
    if (!globeRef.current || !camera) return;

    const point = getRaycastPoint(
      new Vector2(0, 0),
      globeRef,
      raycaster,
      camera
    );

    if (point) {
      const [lon, lat] = point;

      const params = new URLSearchParams(window.location.search);
      params.set("lon", lon.toFixed(4));
      params.set("lat", lat.toFixed(4));

      // Update URL without triggering Next.js navigation/re-rendering
      const newUrl = `${window.location.pathname}?${params.toString()}`;

      try {
        window.history.replaceState({}, "", newUrl);
      } catch (e) {
        console.error("Failed to update URL:", e);
      }
    }
  }, [camera, getRaycastPoint]);

  const handleLocationChange = () => {
    const controls = controlsRef.current;
    if (!controls) return;

    controls.addEventListener("end", saveLocationWhileNavigating);

    return () => {
      controls.removeEventListener("end", saveLocationWhileNavigating);
    };
  };

  useEffect(handleLocationChange, [controlsRef, saveLocationWhileNavigating]);

  ///////////////////////////////
  /// STARFIELD FLICKERING ANIMATION
  ///////////////////////////////

  const flickeringStarfield = (clock: Clock) => {
    if (!starfieldRef.current) return;

    const t = clock.elapsedTime;

    const colors = starfieldRef.current.geometry.attributes.color.array;

    for (let i = 0; i < numStars; i++) {
      const flicker = 0.5 + 0.5 * Math.sin(t * 3 + i * 0.1);

      const hue = 0.6;
      const col = new Color().setHSL(hue, 0.8, flicker);

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    starfieldRef.current.geometry.attributes.color.needsUpdate = true;
  };

  useFrame(({ clock }) => {
    group.update();

    flickeringStarfield(clock);
  });

  ///////////////////////////////
  /// CAMERA INITIALIZATION
  ///////////////////////////////

  const [cameraInit, setCameraInit] = useState(false);

  const cameraInitPos = useMemo(() => {
    const lon = parseFloat(searchParams.get("lon") || "0");
    const lat = parseFloat(searchParams.get("lat") || "0");
    const coords = toGlobeCoords(lon, lat, scaleFactor);
    const magnitude = new Vector3(...coords).length();

    const cameraInitPos = [
      (5 * coords[0]) / magnitude,
      (5 * coords[1]) / magnitude,
      (5 * coords[2]) / magnitude,
    ] as [number, number, number];

    return cameraInitPos;
  }, []);

  const setupCamera = () => {
    camera.position.set(
      cameraInitPos[0] * 200,
      cameraInitPos[1] * 200,
      cameraInitPos[2] * 200
    );

    setCameraInit(true);
  };

  useEffect(() => {
    setupCamera();
  }, []);

  ///////////////////////////////
  /// EARTH ZOOMING INTRO
  ///////////////////////////////

  const animateSceneIntro = () => {
    const tween = new Tween(camera.position)
      .to({ x: cameraInitPos[0], y: cameraInitPos[1], z: cameraInitPos[2] })
      .easing(Easing.Exponential.Out)
      .delay(600)
      .duration(2000)
      .start();

    group.add(tween);
  };

  useEffect(() => {
    if (!sceneLoaded || !cameraInit) return;

    animateSceneIntro();
  }, [sceneLoaded, cameraInit]);

  return (
    cameraInit && (
      <>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <Globe ref={globeRef} scaleFactor={scaleFactor} />
        <Countries
          countries={countries}
          scaleFactor={scaleFactor}
          raycastPoint={getRaycastPoint(pointer, globeRef, raycaster, camera)}
        />
        <Starfield ref={starfieldRef} numStars={numStars} />
        <OrbitControls
          ref={controlsRef}
          rotateSpeed={0.1}
          zoomSpeed={0.8}
          minDistance={2.7}
          enableDamping={false}
        />
      </>
    )
  );
};

export default EarthScene;
