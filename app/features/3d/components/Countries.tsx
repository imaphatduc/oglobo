import { GeoFeature } from "@/app/types";
import CountryBorder from "./CountryBorder";
import CountryMesh from "./CountryMesh";
import { useUI } from "../../ui";
import { useRef } from "react";
import { booleanPointInPolygon } from "@turf/turf";

interface Props {
  countries: GeoFeature[];
  scaleFactor: number;
  raycastPoint?: [number, number];
}

const Countries = ({ countries, scaleFactor, raycastPoint }: Props) => {
  const { selectedContinent, setSelectedCountryIdx, setSceneLoaded } = useUI();

  ///////////////////////////////
  /// RENDERING
  ///////////////////////////////

  const numRenderedCountry = useRef(0);

  const onCountriesRendered = () => {
    numRenderedCountry.current += 1;
    if (numRenderedCountry.current === countries.length) {
      setSceneLoaded(true);
    }
  };

  ///////////////////////////////
  /// SELECTION
  ///////////////////////////////

  const selectCountry = () => {
    if (raycastPoint) {
      const [lon, lat] = raycastPoint;

      const selectedCountryIdx = countries.findIndex((country) =>
        booleanPointInPolygon([lon, lat], country)
      );

      if (selectedCountryIdx) {
        setSelectedCountryIdx(selectedCountryIdx);
      }
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
