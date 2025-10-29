"use client";

import { useRef } from "react";
import { Html, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Euler, Matrix4, Vector3 } from "three";
import { useApp } from "@/app/contexts";
import { GeoFeature } from "@/data";
import { getCountryMeasurements } from "../../lib";

interface Props {
  country: GeoFeature;
  hovering: boolean;
  value?: number;
}

export const NameTag = ({ country, hovering, value }: Props) => {
  const { globeRadius, showCountryNames } = useApp();

  const { centerPoint, area } = getCountryMeasurements(country, globeRadius);
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

  if (hovering) {
    return (
      <Html
        className="bg-neutral-950 min-w-32 h-fit p-2 text-xs rounded-md shadow-lg border border-[#d16014]"
        position={centerPoint}
      >
        <p className="uppercase">{country.properties.NAME_VI}</p>
        <p>{value && value > 0 ? value : "Không có dữ liệu"}</p>
      </Html>
    );
  }

  return (
    showCountryNames &&
    area > 200000000000 && (
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
