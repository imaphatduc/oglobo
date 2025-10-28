import { SphereGeometry } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { useUI } from "../../ui";
import LatLonGrid from "./LatLonGrid";

interface Props {
  ref: any;
}

const Globe = ({ ref }: Props) => {
  const { scaleFactor } = useUI();

  const raycastGlobeGeometry = new SphereGeometry(scaleFactor, 128, 64);
  const globeGeometry = new SphereGeometry(scaleFactor * 0.95, 128, 64).rotateX(
    degToRad(23.5)
  );

  return (
    <group>
      <LatLonGrid radius={scaleFactor * 0.95} />
      <mesh geometry={globeGeometry}>
        <meshBasicMaterial color="#90d5ff" />
      </mesh>
      <mesh ref={ref} geometry={raycastGlobeGeometry}>
        <meshStandardMaterial attach="material" transparent opacity={0} />
      </mesh>
    </group>
  );
};

export default Globe;
