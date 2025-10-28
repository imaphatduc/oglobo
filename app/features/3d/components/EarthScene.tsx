"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Globe from "./Globe";
import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, Color, Points, Raycaster, Vector2 } from "three";
import {
  getCameraPosFromGlobeCoords,
  toGeoCoords,
  toGlobeCoords,
} from "../utils";
import { Easing, Group, Tween } from "@tweenjs/tween.js";
import Starfield from "./Starfield";
import { useUI } from "../../ui";
import { useSearchParams } from "next/navigation";
import Countries from "./Countries";
import { booleanPointInPolygon } from "@turf/turf";

const EarthScene = () => {
  const { countries, sceneLoaded, selectedCountry, selectCountry, getCountry } =
    useUI();

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
  /// UTILS
  ///////////////////////////////

  const getRaycastPoint = (from: Vector2) => {
    if (!globeRef.current) return;

    raycaster.setFromCamera(from, camera);

    const intersects = raycaster.intersectObject(globeRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const [lon, lat] = toGeoCoords(point);
      return [lon, lat] as [number, number];
    }
  };

  ///////////////////////////////
  /// HANDLE COUNTRY SELECTION
  ///////////////////////////////

  const handleCountryMeshClick = () => {
    const point = getRaycastPoint(pointer);

    if (point) {
      const [lon, lat] = point;

      const selectedCountryIdx = countries.findIndex((country) =>
        booleanPointInPolygon([lon, lat], country)
      );

      if (selectedCountryIdx) {
        selectCountry(selectedCountryIdx);
      }
    }
  };

  const setCameraToLookAtCountry = () => {
    if (selectedCountry) {
      const targetCountry = getCountry(selectedCountry?.idx);
      const distanceFromOrigin = camera.position.length();
      const cameraTargetPos = getCameraPosFromGlobeCoords(
        targetCountry.centerPoint,
        distanceFromOrigin
      );

      const tween = new Tween(camera.position)
        .to({
          x: cameraTargetPos[0],
          y: cameraTargetPos[1],
          z: cameraTargetPos[2],
        })
        .easing(Easing.Exponential.Out)
        .duration(2000)
        .start();

      group.add(tween);
    }
  };

  useEffect(() => {
    setCameraToLookAtCountry();
  }, [selectedCountry?.idx]);

  ///////////////////////////////
  /// EARTH NAVIGATION CONTROL
  ///////////////////////////////

  const saveLocationWhileNavigating = useCallback(() => {
    if (!globeRef.current || !camera) return;

    const point = getRaycastPoint(new Vector2(0, 0));

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

  const getCameraInitialPos = () => {
    const lon = parseFloat(searchParams.get("lon") || "0");
    const lat = parseFloat(searchParams.get("lat") || "0");

    const cameraTargetPos = getCameraPosFromGlobeCoords(
      toGlobeCoords(lon, lat, scaleFactor),
      5
    );

    return cameraTargetPos;
  };

  const setupCamera = () => {
    const cameraInitPos = getCameraInitialPos();

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
    const cameraInitPos = getCameraInitialPos();

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
        <Globe ref={globeRef} />
        <Countries handleCountryMeshClick={handleCountryMeshClick} />
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
