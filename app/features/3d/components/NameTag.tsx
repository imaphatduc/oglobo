"use client";

import { Euler, Matrix4, Vector3 } from "three";
import { GeoFeature } from "@/app/types";
import { Text } from "@react-three/drei";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useUI } from "../../ui";
import { getCountryGeoData } from "../utils/getCountryGeoData";

interface Props {
  country: GeoFeature;
  hovering: boolean;
}

const NameTag = ({ country, hovering }: Props) => {
  const { scaleFactor, showCountryNames } = useUI();

  const { centerPoint, countryArea } = getCountryGeoData(country, scaleFactor);
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
    ((showCountryNames && countryArea > 200000000000) || hovering) && (
      <Text
        ref={textRef}
        maxWidth={10}
        fontSize={1.5}
        position={centerPoint}
        rotation={rotation}
        anchorX="center"
        anchorY="middle"
        fontWeight={"bold"}
        color={"black"}
        outlineBlur={0.005}
      >
        {country.properties.NAME_VI}
      </Text>
    )
  );
};

export default NameTag;
