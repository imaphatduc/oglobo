import { CONTINENTS } from "@/app/utils/constants";
import { useUI } from "../contexts/UIContext";

const ContinentsSelect = () => {
  const { selectedContinent, setSelectedContinent } = useUI();

  return (
    <>
      <label htmlFor="mySelect" className="block mb-2 text-sm font-medium">
        Choose continents:
      </label>

      <select
        id="continents-select"
        value={selectedContinent}
        defaultValue=""
        onChange={(e) => setSelectedContinent(e.target.value)}
        className="block px-2 py-2 rounded-sm shadow-sm bg-neutral-600 h-fit focus:ring-0 focus:outline-none"
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

export default ContinentsSelect;
