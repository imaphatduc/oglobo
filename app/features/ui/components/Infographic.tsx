import { useUI } from "../contexts/UIContext";
import CountryInfo from "./CountryInfo";
import CountriesList from "./CountriesList";
import { ArrowLeft } from "lucide-react";

const Infographic = () => {
  const { selectedContinent, selectedCountry, selectCountry } = useUI();

  return (
    <div className="relative pt-3 md:p-3 md:pl-0 h-full">
      {selectedCountry && (
        <button
          className="absolute md:top-0 md:left-0 mx-2 my-2 md:mx-6 md:my-8 p-1 rounded-md hover:bg-neutral-600"
          onClick={() => selectCountry(undefined)}
        >
          <ArrowLeft />
        </button>
      )}

      <div className="bg-neutral-800 text-white h-full overflow-auto md:rounded-md p-8">
        {selectedCountry ? (
          <CountryInfo selectedCountry={selectedCountry} />
        ) : (
          <>{selectedContinent && <CountriesList />}</>
        )}
      </div>
    </div>
  );
};

export default Infographic;
