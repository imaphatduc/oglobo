import { Suspense, use, useRef } from "react";
import { Color } from "three";
import { useApp } from "@/app/contexts";
import { CountryBorder } from "./CountryBorder";
import { CountryMesh } from "./CountryMesh";

interface Props {
  countriesData: Promise<{ colors: Color[]; values: number[] }>;
  handleCountryMeshClick: () => void;
}

export const Countries = ({ countriesData, handleCountryMeshClick }: Props) => {
  const { countries, selectedContinent, setSceneLoaded, datasetKey } = useApp();

  const numRenderedCountry = useRef(0);

  const onCountriesRendered = () => {
    numRenderedCountry.current += 1;

    if (numRenderedCountry.current === countries.length) {
      setSceneLoaded(true);
    }
  };

  const { values, colors } = use(countriesData);

  return (
    <Suspense>
      {countries.map(
        (country, i) =>
          (selectedContinent === "" ||
            country.properties.CONTINENTS?.map((c) => c.toLowerCase()).includes(
              selectedContinent.toLowerCase()
            )) && (
            <group key={i} onClick={handleCountryMeshClick}>
              <CountryBorder country={country} />
              <CountryMesh
                onRendered={onCountriesRendered}
                country={country}
                value={datasetKey ? values[i] : undefined}
                color={datasetKey ? colors[i] : undefined}
              />
            </group>
          )
      )}
    </Suspense>
  );
};
