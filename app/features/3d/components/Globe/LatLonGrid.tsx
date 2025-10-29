import { useMemo } from "react";

type Props = {
  radius?: number;
  latStepDeg?: number; // spacing for latitude lines (degrees)
  lonStepDeg?: number; // spacing for longitude lines (degrees)
  segments?: number; // points per line
  color?: string;
};

export default function LatLonGrid({
  radius = 1,
  latStepDeg = 15,
  lonStepDeg = 15,
  segments = 128,
  color = "#000",
}: Props) {
  const latLines = useMemo(() => {
    const lines: Float32Array[] = [];
    for (let lat = -90 + latStepDeg; lat < 90; lat += latStepDeg) {
      const latRad = (lat * Math.PI) / 180;
      const y = radius * Math.sin(latRad);
      const r = Math.abs(radius * Math.cos(latRad));
      const pts = new Float32Array((segments + 1) * 3);
      for (let i = 0; i <= segments; i++) {
        const phi = (i / segments) * Math.PI * 2;
        const x = r * Math.cos(phi);
        const z = r * Math.sin(phi);
        const idx = i * 3;
        pts[idx] = x;
        pts[idx + 1] = y;
        pts[idx + 2] = z;
      }
      lines.push(pts);
    }
    return lines;
  }, [radius, latStepDeg, segments]);

  const lonLines = useMemo(() => {
    const lines: Float32Array[] = [];
    for (let lon = 0; lon < 360; lon += lonStepDeg) {
      const lonRad = (lon * Math.PI) / 180;
      const pts = new Float32Array((segments + 1) * 3);
      for (let i = 0; i <= segments; i++) {
        const latT = -Math.PI / 2 + (i / segments) * Math.PI; // -90..90
        const x = radius * Math.cos(latT) * Math.cos(lonRad);
        const y = radius * Math.sin(latT);
        const z = radius * Math.cos(latT) * Math.sin(lonRad);
        const idx = i * 3;
        pts[idx] = x;
        pts[idx + 1] = y;
        pts[idx + 2] = z;
      }
      lines.push(pts);
    }
    return lines;
  }, [radius, lonStepDeg, segments]);

  return (
    <group>
      {/* Latitude lines */}
      {latLines.map((positions, i) => (
        <line key={`lat-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} linewidth={1} toneMapped={false} />
        </line>
      ))}

      {/* Longitude lines */}
      {lonLines.map((positions, i) => (
        <line key={`lon-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]} // <--- positions array, itemSize = 3
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} linewidth={1} toneMapped={false} />
        </line>
      ))}
    </group>
  );
}
