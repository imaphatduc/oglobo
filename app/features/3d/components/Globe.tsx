import { EdgesGeometry, SphereGeometry } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { useUI } from "../../ui";

interface Props {
  ref: any;
}

const Globe = ({ ref }: Props) => {
  const { scaleFactor } = useUI();

  const raycastGlobeGeometry = new SphereGeometry(scaleFactor, 32, 16);
  const globeGeometry = new SphereGeometry(scaleFactor * 0.95, 32, 16).rotateX(
    degToRad(23.5)
  );
  const globeWiredGeometry = new EdgesGeometry(globeGeometry);

  return (
    <group>
      <lineSegments geometry={globeWiredGeometry}>
        <lineBasicMaterial color="#333" />
      </lineSegments>
      <mesh geometry={globeGeometry}>
        <meshBasicMaterial attach="material" color="#90d5ff" />
      </mesh>
      <mesh ref={ref} geometry={raycastGlobeGeometry}>
        <meshBasicMaterial attach="material" transparent opacity={0} />
      </mesh>
    </group>
  );
};

export default Globe;
