import { Color } from "three";
import { V3 } from "../types";

export default function getStarfield({ numStars = 500 } = {}) {
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return {
      pos: [x, y, z] as V3,
      hue: 0.6,
      minDist: radius,
    };
  }

  const vertices: V3[] = [];
  const colors = [];
  let col;

  for (let i = 0; i < numStars; i++) {
    let p = randomSpherePoint();
    const { pos, hue } = p;
    col = new Color().setHSL(hue, 0.2, Math.random());
    vertices.push(pos);
    colors.push(col.r, col.g, col.b);
  }

  return { vertices, colors };
}
