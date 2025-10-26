"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GeoFeature } from "@/app/types";
import Globe from "./Globe";
import { useEffect, useRef, useState } from "react";
import CountryBorder3D from "./CountryBorder3D";
import { Color, Points, Raycaster } from "three";
import { toGeoCoords } from "../utils";
import Country3D from "./Country3D";
import { booleanPointInPolygon } from "@turf/turf";
import { Easing, Group, Tween } from "@tweenjs/tween.js";
import Starfield from "./Starfield";
import { useUI } from "../../ui";

interface Props {
  countries: GeoFeature[];
}

const EarthScene = ({ countries }: Props) => {
  const {
    selectedContinent,
    setSelectedContinent,
    screenLoaded,
    setScreenLoaded,
    setSelectedCountryIdx,
  } = useUI();

  const scaleFactor = 2.5;

  const globeRef = useRef(null);

  const { camera, mouse } = useThree();

  const raycaster = new Raycaster();

  const selectCountry = () => {
    if (!globeRef.current) return;

    const getSelectedCountryIdx = (lon: number, lat: number) =>
      countries.findIndex((country) =>
        booleanPointInPolygon([lon, lat], country)
      );

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(globeRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const [lon, lat] = toGeoCoords(point);
      const selectedCountryIdx = getSelectedCountryIdx(lon, lat);

      if (selectedCountryIdx) {
        setSelectedCountryIdx(selectedCountryIdx);
      }
    }
  };

  const group = new Group();

  const numStars = 2000;

  const starfieldRef = useRef<Points>(null);

  useFrame(({ clock }) => {
    group.update();

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
  });

  const numRenderedCountry = useRef(0);

  const [cameraInit, setCameraInit] = useState(false);

  const onCountriesRendered = () => {
    numRenderedCountry.current += 1;
    if (numRenderedCountry.current === countries.length) {
      setScreenLoaded(true);
    }
  };

  useEffect(() => {
    camera.position.set(0, 0, 200);
    setCameraInit(true);
  }, []);

  useEffect(() => {
    if (!screenLoaded || !cameraInit) return;
    const tween = new Tween(camera.position)
      .to({ x: 0, y: 0, z: 5 }, 2000)
      .easing(Easing.Exponential.Out)
      .start();
    group.add(tween);
  }, [screenLoaded, cameraInit]);

  return (
    cameraInit && (
      <>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <Globe ref={globeRef} scaleFactor={scaleFactor} />
        {countries.map(
          (country, i) =>
            (selectedContinent === "" ||
              country.properties.CONTINENTS?.map((c) =>
                c.toLowerCase()
              ).includes(selectedContinent.toLowerCase())) && (
              <group key={i} onClick={selectCountry}>
                <CountryBorder3D country={country} scaleFactor={scaleFactor} />
                <Country3D
                  onRendered={onCountriesRendered}
                  countries={countries}
                  country={country}
                  scaleFactor={scaleFactor}
                />
              </group>
            )
        )}
        <Starfield ref={starfieldRef} numStars={numStars} />
        <OrbitControls
          rotateSpeed={0.1}
          zoomSpeed={0.4}
          minDistance={2.7}
          enableDamping={false}
        />
      </>
    )
  );
};

export default EarthScene;
