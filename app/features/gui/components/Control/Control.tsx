import { ContinentsSelect } from "./ContinentsSelect";
import { DatasetSelect } from "./DatasetSelect";
import { ShowCountryNamesToggle } from "./ShowCountryNamesToggle";

export const Control = () => {
  return (
    <div className="grid grid-cols-[auto_2fr] items-center gap-5 p-3 rounded-br-md justify-between text-xs border-b border-r border-green-500 bg-neutral-950 shadow-md">
      <ShowCountryNamesToggle />
      <ContinentsSelect />
      <DatasetSelect />
    </div>
  );
};
