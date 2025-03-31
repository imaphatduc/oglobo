import React, { Ref, useMemo } from "react";
import { AdditiveBlending, Points, TextureLoader } from "three";
import getStarfield from "../utils/getStarfield";

interface Props {
  numStars: number;
  ref: Ref<Points>;
}

const Starfield = ({ ref, numStars }: Props) => {
  const { vertices, colors } = useMemo(() => getStarfield({ numStars }), []);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(vertices.flat()), 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[new Float32Array(colors), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        map={new TextureLoader().load("/textures/star.png")}
      />
    </points>
  );
};

export default Starfield;
