import { Html } from "@react-three/drei";
import { useApp } from "@/app/contexts";
import { GeoFeature } from "@/data";
import { getCountryMeasurements } from "../../lib";

interface Props {
  country: GeoFeature;
  hovering: boolean;
  unit: string;
  value: number;
}

export const DataPad = ({ country, hovering, unit, value }: Props) => {
  const { globeRadius, datasetKey } = useApp();

  const { centerPoint } = getCountryMeasurements(country, globeRadius);

  return (
    hovering && (
      <Html
        className="bg-neutral-950 min-w-32 h-fit p-2 text-xs rounded-md shadow-lg border border-[#d16014]"
        position={centerPoint}
      >
        <p className="uppercase">{country.properties.NAME_VI}</p>
        {datasetKey && (
          <p>
            {value && value > 0
              ? `${value.toFixed(2)} (${unit})`
              : "Không có dữ liệu"}
          </p>
        )}
      </Html>
    )
  );
};
