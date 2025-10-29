import { CONTINENTS } from "@/data";
import { useApp } from "@/app/contexts";

export const ContinentsSelect = () => {
  const { selectedContinent, setSelectedContinent } = useApp();

  return (
    <>
      <label htmlFor="mySelect" className="block mb-2 font-medium">
        Hiện châu lục
      </label>

      <select
        id="continents-select"
        value={selectedContinent}
        onChange={(e) => setSelectedContinent(e.target.value)}
        className="block px-2 py-2 rounded-md shadow-md bg-neutral-600 h-fit focus:ring-0 focus:outline-none"
      >
        <option value="">Tất cả</option>

        {Object.keys(CONTINENTS).map((continent, i) => (
          <option key={i} value={continent}>
            {continent}
          </option>
        ))}
      </select>
    </>
  );
};
