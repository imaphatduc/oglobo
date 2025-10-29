"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
} from "three";
import earcut from "earcut";
import { useApp } from "@/app/contexts";
import { uniformCoords } from "@/app/lib";
import { GeoFeature } from "@/data";
import { toGlobeCoords } from "../../lib";
import { NameTag } from "./NameTag";

interface Props {
  onRendered: () => void;
  country: GeoFeature;
  color?: string;
}

export const CountryMesh = ({ onRendered, country, color }: Props) => {
  const { globeRadius, selectedCountry } = useApp();

  useEffect(() => {
    onRendered();
  }, []);

  const geometries = useMemo(() => {
    const geometries = uniformCoords(country).map((land) => {
      const vertices = land[0];
      const triangles = earcut(vertices.flat(), []);
      const geometry = new BufferGeometry();
      geometry.setAttribute(
        "position",
        new Float32BufferAttribute(
          vertices
            .map(([lon, lat]) => {
              const coords = toGlobeCoords(lon, lat, globeRadius);
              return [coords.x, coords.y, coords.z];
            })
            .flat(),
          3
        )
      );
      geometry.setIndex(triangles);
      return geometry;
    });

    return geometries;
  }, [country]);

  const [hovering, setHovering] = useState(false);

  const renderedColor = new Color(country.properties.COLOR).multiplyScalar(
    country.properties.WIKIDATAID === selectedCountry?.properties.WIKIDATAID ||
      hovering
      ? 0.3
      : 1
  );

  return (
    <group
      onPointerOver={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <NameTag country={country} hovering={hovering} />
      {geometries.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshBasicMaterial color={color ?? renderedColor} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};
