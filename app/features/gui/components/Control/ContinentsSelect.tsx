import { CONTINENTS } from "@/data";
import { useApp } from "@/app/contexts";
import { DropdownSelect } from "@/app/utils";

export const ContinentsSelect = () => {
  const { selectedContinent, setSelectedContinent } = useApp();

  return (
    <DropdownSelect
      label="Hiện châu lục"
      value={selectedContinent}
      defaultValue="Tất cả"
      onChange={(e) => setSelectedContinent(e.target.value)}
      options={Object.keys(CONTINENTS)}
    />
  );
};
