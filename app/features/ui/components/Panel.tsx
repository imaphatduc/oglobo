import { GeoFeature } from "@/app/types";
import ToggleButton from "../../3d/components/ToggleButton";
import { useUI } from "../contexts/UIContext";
import CountryInfo from "./CountryInfo";

interface Props {
  countries: GeoFeature[];
}

const Panel = ({ countries }: Props) => {
  const { selectedCountryIdx, showCountryNames, toggleCountryNames } = useUI();

  return (
    <div className="w-[30rem] p-3 relative">
      <div className="sticky top-3 bottom-3 bg-neutral-800 text-white w-full h-[calc(100vh-1.5rem)] overflow-auto rounded-md p-8">
        <div className="grid grid-cols-2 gap-5 justify-between text-sm mb-6">
          <p>Show country names</p>
          <ToggleButton
            checked={showCountryNames}
            onChange={toggleCountryNames}
          />
        </div>

        {selectedCountryIdx && countries[selectedCountryIdx] && (
          <CountryInfo selectedCountry={countries[selectedCountryIdx]} />
        )}
      </div>
    </div>
  );
};

export default Panel;
