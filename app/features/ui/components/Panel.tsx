import { GeoFeature } from "@/app/types";
import { useUI } from "../contexts/UIContext";
import CountryInfo from "./CountryInfo";
import CountriesList from "./CountriesList";

interface Props {
  countries: GeoFeature[];
}

const Panel = ({ countries }: Props) => {
  const { selectedCountryIdx } = useUI();

  return (
    <div className="w-[30rem] p-3 relative">
      <div className="sticky top-3 bottom-3 bg-neutral-800 text-white w-full h-[calc(100vh-1.5rem)] overflow-auto rounded-md p-8">
        <CountriesList countries={countries} />
        {selectedCountryIdx && countries[selectedCountryIdx] && (
          <CountryInfo selectedCountry={countries[selectedCountryIdx]} />
        )}
      </div>
    </div>
  );
};

export default Panel;
