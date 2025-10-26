import { GeoFeature } from "@/app/types";
import { useUI } from "../contexts/UIContext";
import CountryInfo from "./CountryInfo";
import CountriesList from "./CountriesList";
import { ArrowLeft } from "lucide-react";

interface Props {
  countries: GeoFeature[];
}

const Infographic = ({ countries }: Props) => {
  const { selectedContinent, selectedCountryIdx, setSelectedCountryIdx } =
    useUI();

  return (
    <div className="relative p-3 pl-0">
      {selectedCountryIdx && (
        <button
          className="absolute top-0 left-0 mx-6 my-8 p-1 rounded-md hover:bg-neutral-600"
          onClick={() => setSelectedCountryIdx(undefined)}
        >
          <ArrowLeft />
        </button>
      )}

      <div className="bg-neutral-800 text-white w-full h-[calc(100vh-1.5rem)] overflow-auto rounded-md p-8">
        {selectedCountryIdx && countries[selectedCountryIdx] ? (
          <CountryInfo selectedCountry={countries[selectedCountryIdx]} />
        ) : (
          <>{selectedContinent && <CountriesList countries={countries} />}</>
        )}
      </div>
    </div>
  );
};

export default Infographic;
