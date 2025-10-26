import { GeoFeature } from "@/app/types";
import { useUI } from "../contexts/UIContext";

interface Props {
  countries: GeoFeature[];
}

const CountriesList = ({ countries }: Props) => {
  const { selectedContinent } = useUI();

  const continentalCountries = selectedContinent
    ? countries
        .filter((country) =>
          country.properties.CONTINENTS?.map((c) => c.toLowerCase()).includes(
            selectedContinent.toLowerCase()
          )
        )
        .sort((a, b) =>
          a.properties.NAME_VI.localeCompare(b.properties.NAME_VI, undefined, {
            sensitivity: "base",
          })
        )
    : [];

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10">
      {continentalCountries.map((country, idx) => (
        <div key={idx} className="space-y-3">
          {country.properties.FLAG && (
            <img
              src={`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
                country.properties.FLAG
              )}`}
              className="h-20 rounded-md"
            />
          )}
          <p>{country.properties.NAME_VI}</p>
        </div>
      ))}
    </div>
  );
};

export default CountriesList;
