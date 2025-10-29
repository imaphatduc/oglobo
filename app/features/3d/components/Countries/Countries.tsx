import { Suspense, use, useMemo, useRef } from "react";
import { useApp } from "@/app/contexts";
import { CountryBorder } from "./CountryBorder";
import { CountryMesh } from "./CountryMesh";

interface Props {
  colorsFromData: Promise<string[]>;
  handleCountryMeshClick: () => void;
}

export const Countries = ({
  colorsFromData,
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

  const resolvedColors = use(colorsFromData);

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
                color={datasetKey ? resolvedColors[i] : undefined}
              />
            </group>
          )
      )}
    </Suspense>
  );
};
