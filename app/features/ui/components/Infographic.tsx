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
    <div className="relative pt-3 md:p-3 md:pl-0 h-full">
      {selectedCountryIdx && (
        <button
          className="absolute md:top-0 md:left-0 mx-2 my-2 md:mx-6 md:my-8 p-1 rounded-md hover:bg-neutral-600"
          onClick={() => setSelectedCountryIdx(undefined)}
        >
          <ArrowLeft />
        </button>
      )}

      <div className="bg-neutral-800 text-white h-full overflow-auto md:rounded-md p-8">
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
