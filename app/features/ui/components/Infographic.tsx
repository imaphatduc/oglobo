import { GeoFeature } from "@/app/types";
import { useUI } from "../contexts/UIContext";
import CountryInfo from "./CountryInfo";
import CountriesList from "./CountriesList";

interface Props {
  countries: GeoFeature[];
}

const Infographic = ({ countries }: Props) => {
  const { selectedCountryIdx } = useUI();

  return (
    <div className="p-3 pl-0">
      <div className="bg-neutral-800 text-white w-full h-[calc(100vh-1.5rem)] overflow-auto rounded-md p-8">
        <CountriesList countries={countries} />
        {selectedCountryIdx && countries[selectedCountryIdx] && (
          <CountryInfo selectedCountry={countries[selectedCountryIdx]} />
        )}
      </div>
    </div>
  );
};

export default Infographic;
