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
import { DataPad } from "./DataPad";

interface Props {
  onRendered: () => void;
  country: GeoFeature;
  unit?: string;
  value?: number;
  color?: Color;
}

export const CountryMesh = ({
  onRendered,
  country,
  unit,
  value,
  color,
}: Props) => {
  const { globeRadius, selectedCountry, datasetKey } = useApp();

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
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovering(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHovering(false);
      }}
    >
      {datasetKey && unit && value ? (
        <DataPad
          country={country}
          hovering={hovering}
          unit={unit}
          value={value}
        />
      ) : (
        <NameTag country={country} hovering={hovering} />
      )}
      {geometries.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshBasicMaterial color={color ?? renderedColor} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};
