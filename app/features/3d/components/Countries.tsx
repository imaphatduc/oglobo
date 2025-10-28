import CountryBorder from "./CountryBorder";
import CountryMesh from "./CountryMesh";
import { useUI } from "../../ui";
import { useRef } from "react";

interface Props {
  handleCountryMeshClick: () => void;
}

const Countries = ({ handleCountryMeshClick }: Props) => {
  const { countries, selectedContinent, setSceneLoaded } = useUI();

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

export default Countries;
