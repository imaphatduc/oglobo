import { GeoFeature } from "@/app/types";
import CountryBorder from "./CountryBorder";
import CountryMesh from "./CountryMesh";
import { useUI } from "../../ui";
import { useRef } from "react";

interface Props {
  countries: GeoFeature[];
  scaleFactor: number;
  selectCountry: () => void;
}

const Countries = ({ countries, scaleFactor, selectCountry }: Props) => {
  const { selectedContinent, setSceneLoaded } = useUI();

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
            <group key={i} onClick={selectCountry}>
              <CountryBorder country={country} scaleFactor={scaleFactor} />
              <CountryMesh
                onRendered={onCountriesRendered}
                countries={countries}
                country={country}
                scaleFactor={scaleFactor}
              />
            </group>
          )
      )}
    </>
  );
};

export default Countries;
