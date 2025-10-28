import { Vector3 } from "three";
import { V3 } from "../types";

export const getCameraPosFromGlobeCoords = (
  coords: V3,
  distanceFromOrigin: number
) => {
  const magnitude = new Vector3(...coords).length();

  const pos = [
    (distanceFromOrigin * coords[0]) / magnitude,
    (distanceFromOrigin * coords[1]) / magnitude,
    (distanceFromOrigin * coords[2]) / magnitude,
  ] as [number, number, number];

  return pos;
};
