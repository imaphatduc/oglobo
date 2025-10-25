import { GeoFeature } from "@/app/types";
import { toGlobeCoords, uniformCoords } from "../utils";
import {
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
} from "three";
import { useEffect, useMemo, useState } from "react";
import NameTag from "./NameTag";
import earcut from "earcut";

interface Props {
  onRendered: () => void;
  country: GeoFeature;
  selectedCountry?: GeoFeature;
  scaleFactor: number;
}

const Country3D = ({
  onRendered,
  country,
  selectedCountry,
  scaleFactor,
}: Props) => {
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
            .map(([lon, lat]) => toGlobeCoords(lon, lat, scaleFactor))
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
      <NameTag
        country={country}
        scaleFactor={scaleFactor}
        color={country.properties.COLOR}
        hovering={hovering}
      />
      {geometries.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshBasicMaterial color={renderedColor} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

export default Country3D;
