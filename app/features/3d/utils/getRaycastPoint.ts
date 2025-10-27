import { RefObject } from "react";
import { Camera, Raycaster, Vector2 } from "three";
import { toGeoCoords } from "./toGeoCoords";

export const getRaycastPoint = (
  from: Vector2,
  globeRef: RefObject<null>,
  raycaster: Raycaster,
  camera: Camera
) => {
  if (!globeRef.current) return;

  raycaster.setFromCamera(from, camera);

  const intersects = raycaster.intersectObject(globeRef.current);

  if (intersects.length > 0) {
    const point = intersects[0].point;
    const [lon, lat] = toGeoCoords(point);
    return [lon, lat] as [number, number];
  }
};
