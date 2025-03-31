import { area, centroid } from "@turf/turf";
import { uniformCoords } from "../utils/uniformCoords";
import { toGlobeCoords } from "../utils/toGlobeCoords";
import { Color, Euler, Matrix4, Vector3 } from "three";
import { GeoFeature } from "@/app/types";
import { Text } from "@react-three/drei";

interface Props {
  country: GeoFeature;
  scaleFactor: number;
  color: string;
  hovering: boolean;
}

const NameTag = ({ country, scaleFactor, color, hovering }: Props) => {
  const uniformedCountry = uniformCoords(country);

  let countryArea = 0;
  const firstLandGeoData = {
    type: "Polygon" as const,
    coordinates: uniformedCountry[0],
  };
  const largestLandGeoData = uniformedCountry.reduce((acc, land) => {
    const landGeoData = { type: "Polygon" as const, coordinates: land };
    const landArea = area(landGeoData);
    countryArea += landArea;
    return landArea > area(acc) ? landGeoData : acc;
  }, firstLandGeoData);

  const [lonCenter, latCenter] =
    centroid(largestLandGeoData).geometry.coordinates;
  const centerPoint = toGlobeCoords(lonCenter, latCenter, scaleFactor);
  const normal = new Vector3(...centerPoint).normalize();

  const up = new Vector3(0, 1, 0);
  const tangent = new Vector3().crossVectors(up, normal).normalize();
  const adjustedUp = new Vector3().crossVectors(normal, tangent).normalize();
  const matrix = new Matrix4().makeBasis(tangent, adjustedUp, normal);
  const rotation = new Euler().setFromRotationMatrix(matrix);

  return (
    (countryArea > 200000000000 || hovering) && (
      <Text
        fontSize={0.05}
        position={centerPoint}
        rotation={rotation}
        anchorX="center"
        anchorY="middle"
        color={new Color(color).multiplyScalar(hovering ? 1 : 0.3)}
        fontWeight={"bold"}
        strokeColor={"black"}
        strokeWidth={0.002}
        outlineBlur={0.005}
      >
        {country.properties.NAME_VI}
      </Text>
    )
  );
};

export default NameTag;
