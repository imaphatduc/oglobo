import { area, centroid } from "@turf/turf";
import { uniformCoords } from "../utils/uniformCoords";
import { toGlobeCoords } from "../utils/toGlobeCoords";
import { Color, Euler, Matrix4, Vector3 } from "three";
import { GeoFeature } from "@/app/types";
import { Text } from "@react-three/drei";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

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

  const textRef = useRef<Text>(null);

  const { camera } = useThree();

  useFrame(() => {
    if (!textRef.current) return;

    // Compute distance between camera and text
    // @ts-expect-error
    const camDistance = camera.position.distanceTo(textRef.current.position);
    // Adjust scale so that text appears fixed on screen
    const scale = camDistance * 0.02; // tweak constant to match desired pixel size
    // @ts-expect-error
    textRef.current.scale.set(scale, scale, scale);
  });

  return (
    (countryArea > 200000000000 || hovering) && (
      <Text
        ref={textRef}
        maxWidth={10}
        fontSize={1.5}
        position={centerPoint}
        rotation={rotation}
        anchorX="center"
        anchorY="middle"
        color={new Color(color).multiplyScalar(hovering ? 1 : 0.3)}
        fontWeight={"bold"}
        strokeColor={"black"}
        strokeWidth={0.1}
        outlineBlur={0.005}
      >
        {country.properties.NAME_VI}
      </Text>
    )
  );
};

export default NameTag;
