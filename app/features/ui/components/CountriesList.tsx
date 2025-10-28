import { useUI } from "../contexts/UIContext";

const CountriesList = () => {
  const { countries, selectedContinent, selectCountry } = useUI();

  const continentalCountries = selectedContinent
    ? countries
        .map((country, idx) => ({
          idx,
          ...country,
        }))
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
    <>
      <h1 className="text-center uppercase font-bold text-2xl mb-8">
        {selectedContinent}
      </h1>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10">
        {continentalCountries.map((country) => (
          <div
            key={country.idx}
            className="space-y-3 cursor-pointer"
            onClick={() => selectCountry(country.idx)}
          >
            {country.properties.FLAG && (
              <img
                src={`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
                  country.properties.FLAG
                )}`}
                className="h-20 rounded-md"
              />
            )}
            <p className="hover:underline underline-offset-4">
              {country.properties.NAME_VI}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default CountriesList;
