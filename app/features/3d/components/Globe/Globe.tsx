import { SphereGeometry } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { useApp } from "@/app/contexts";
import LatLonGrid from "./LatLonGrid";

interface Props {
  ref: any;
}

export const Globe = ({ ref }: Props) => {
  const { globeRadius, datasetKey } = useApp();

  const raycastGlobeGeometry = new SphereGeometry(globeRadius, 128, 64);

  const globeGeometry = new SphereGeometry(globeRadius * 0.95, 128, 64).rotateX(
    degToRad(23.5)
  );

  return (
    <group>
      <LatLonGrid radius={globeRadius * 0.95} />
      <mesh geometry={globeGeometry}>
        <meshBasicMaterial color={datasetKey ? "#dad7cd" : "#90d5ff"} />
      </mesh>
      <mesh ref={ref} geometry={raycastGlobeGeometry}>
        <meshStandardMaterial attach="material" transparent opacity={0} />
      </mesh>
    </group>
  );
};
