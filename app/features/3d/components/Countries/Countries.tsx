import { useRef } from "react";
import { useApp } from "@/app/contexts";
import { CountryBorder } from "./CountryBorder";
import { CountryMesh } from "./CountryMesh";

interface Props {
  handleCountryMeshClick: () => void;
}

export const Countries = ({ handleCountryMeshClick }: Props) => {
  const { countries, selectedContinent, setSceneLoaded } = useApp();

  const numRenderedCountry = useRef(0);

  const onCountriesRendered = () => {
    numRenderedCountry.current += 1;

    if (numRenderedCountry.current === countries.length) {
      setSceneLoaded(true);
    }
  };

  return (
    <>
      {countries.map(
        (country, i) =>
          (selectedContinent === "" ||
            country.properties.CONTINENTS?.map((c) => c.toLowerCase()).includes(
              selectedContinent.toLowerCase()
            )) && (
            <group key={i} onClick={handleCountryMeshClick}>
              <CountryBorder country={country} />
              <CountryMesh onRendered={onCountriesRendered} country={country} />
            </group>
          )
      )}
    </>
  );
};
