import { GeoFeature } from "@/app/types";
import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { toGlobeCoords, uniformCoords } from "../utils";
import { useUI } from "../../ui";

interface Props {
  country: GeoFeature;
}

const CountryBorder = ({ country }: Props) => {
  const { scaleFactor } = useUI();

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
