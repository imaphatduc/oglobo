import { Vector3 } from "three";

export const getCameraPosFromGlobeCoords = (
  coords: Vector3,
  distanceFromOrigin: number
) => {
  const magnitude = new Vector3(...coords).length();

  const pos = [
    (distanceFromOrigin * coords.x) / magnitude,
    (distanceFromOrigin * coords.y) / magnitude,
    (distanceFromOrigin * coords.z) / magnitude,
  ] as [number, number, number];

  return pos;
};
