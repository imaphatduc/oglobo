import { memo, Ref } from "react";
import { AdditiveBlending, Points, TextureLoader } from "three";
import { getStarfield } from "./getStarfield";

interface Props {
  numStars: number;
  ref: Ref<Points>;
}

const StarfieldCore = ({ ref, numStars }: Props) => {
  const { vertices, colors } = getStarfield({ numStars });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[
            new Float32Array(vertices.map((v) => [v.x, v.y, v.z]).flat()),
            3,
          ]}
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

export const Starfield = memo(StarfieldCore, () => true);
