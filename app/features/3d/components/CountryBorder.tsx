import { GeoFeature } from "@/app/types";
import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { toGlobeCoords, uniformCoords } from "../utils";

interface Props {
  country: GeoFeature;
  scaleFactor: number;
}

const CountryBorder = ({ country, scaleFactor }: Props) => {
  const boundary = useMemo(
    () =>
      uniformCoords(country).map((land) =>
        land[0].map(([lon, lat]) => toGlobeCoords(lon, lat, scaleFactor))
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

export default CountryBorder;
