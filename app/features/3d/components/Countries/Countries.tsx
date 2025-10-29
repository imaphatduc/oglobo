import { Suspense, use, useRef } from "react";
import { Color } from "three";
import { useApp } from "@/app/contexts";
import { CountryBorder } from "./CountryBorder";
import { CountryMesh } from "./CountryMesh";

interface Props {
  countriesDataPromise: Promise<
    { unit: string; colors: Color[]; values: number[] } | undefined
  >;
  handleCountryMeshClick: () => void;
}

export const Countries = ({
  countriesDataPromise,
  handleCountryMeshClick,
}: Props) => {
  const { countries, selectedContinent, setSceneLoaded, datasetKey } = useApp();

  const numRenderedCountry = useRef(0);

  const onCountriesRendered = () => {
    numRenderedCountry.current += 1;

    if (numRenderedCountry.current === countries.length) {
      setSceneLoaded(true);
    }
  };

  const countriesData = use(countriesDataPromise);

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
                unit={countriesData?.unit}
                value={
                  datasetKey && countriesData
                    ? countriesData.values[i]
                    : undefined
                }
                color={
                  datasetKey && countriesData
                    ? countriesData.colors[i]
                    : undefined
                }
              />
            </group>
          )
      )}
    </Suspense>
  );
};
