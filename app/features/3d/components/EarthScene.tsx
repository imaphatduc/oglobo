"use client";

import { useSearchParams } from "next/navigation";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Clock, Color, Points, Raycaster, Vector2, Vector3 } from "three";
import { Easing, Group, Tween } from "@tweenjs/tween.js";
import { booleanPointInPolygon } from "@turf/turf";
import { useApp } from "@/app/contexts";
import { getDataClientSide } from "../../dataset/lib/getDataClientSide";
import {
  getCameraPosFromGlobeCoords,
  getCountryMeasurements,
  toGeoCoords,
  toGlobeCoords,
  getCountriesColorsFromData,
} from "../lib";
import { Starfield } from "./Starfield";
import { Globe } from "./Globe";
import { Countries } from "./Countries";

export const EarthScene = () => {
  const { countries, sceneLoaded, selectedCountry, selectCountry, datasetKey } =
    useApp();

  const globeRadius = 2.5;

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
      const { centerPoint } = getCountryMeasurements(
        selectedCountry,
        globeRadius
      );

      const distanceFromOrigin = camera.position.length();

      const cameraTargetPos = new Vector3(
        ...getCameraPosFromGlobeCoords(centerPoint, distanceFromOrigin)
      );

      const origin = new Vector3(0, 0, 0);

      const getRotationParams = (pos: Vector3) => {
        const vec = new Vector3().copy(pos).sub(origin);
        const distance = vec.length();
        const theta = Math.atan2(vec.x, vec.z);
        const phi = Math.acos(vec.y / distance);
        return { r: distance, theta, phi };
      };

      const getPosition = (theta: number, phi: number, radius: number) => {
        return new Vector3(
          radius * Math.sin(phi) * Math.sin(theta), // x
          radius * Math.cos(phi), // y
          radius * Math.sin(phi) * Math.cos(theta) // z
        ).add(origin);
      };

      const shortestAngle = (start: number, end: number) => {
        let delta = end - start;
        if (delta > Math.PI) delta -= 2 * Math.PI;
        if (delta < -Math.PI) delta += 2 * Math.PI;
        return start + delta;
      };

      const start = getRotationParams(camera.position);
      const end = getRotationParams(cameraTargetPos);
      const adjustedEndTheta = shortestAngle(start.theta, end.theta);

      const tween = new Tween(start)
        .to({ ...end, theta: adjustedEndTheta })
        .onUpdate(({ theta, phi, r }) => {
          const pos = getPosition(theta, phi, r);
          camera.position.set(pos.x, pos.y, pos.z);
          camera.lookAt(origin);
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
    camera.lookAt(0, 0, 0);

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
      toGlobeCoords(lon, lat, globeRadius),
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
      .duration(2000)
      .start();

    group.add(tween);
  };

  useEffect(() => {
    if (!sceneLoaded || !cameraInit) return;

    animateSceneIntro();
  }, [sceneLoaded, cameraInit]);

  ///////////////////////////////

  const countriesDataPromise = useMemo(async () => {
    const res = await getDataClientSide(datasetKey);

    if (!res) return;

    const { dataset, data } = res;

    const values = countries.map((country) => {
      const countryData = data.find(
        (d: any) => d.countryId === country.properties.WB_A3
      );

      const value = countryData ? parseFloat(countryData.value) : 0;

      return value;
    });

    const colors = getCountriesColorsFromData(values);

    return { unit: dataset.unit, values, colors };
  }, [datasetKey]);

  return (
    cameraInit && (
      <>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <Globe ref={globeRef} />
        <Suspense>
          <Countries
            handleCountryMeshClick={handleCountryMeshClick}
            countriesDataPromise={countriesDataPromise}
          />
        </Suspense>
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
