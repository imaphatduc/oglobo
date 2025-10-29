import { GeoFeature } from "@/data";
import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { useApp } from "@/app/contexts";
import { uniformCoords } from "@/app/lib";
import { toGlobeCoords } from "../../lib";

interface Props {
  country: GeoFeature;
}

export const CountryBorder = ({ country }: Props) => {
  const { globeRadius } = useApp();

  const boundary = useMemo(
    () =>
      uniformCoords(country).map((land) =>
        land[0].map(([lon, lat]) => toGlobeCoords(lon, lat, globeRadius))
      ),
    [country]
  );

  return (
    <group>
      {boundary.map((points, i) => (
        <Line key={i} points={points} color="black" linewidth={2} />
      ))}
    </group>
  );
};
