import ContinentsSelect from "./ContinentsSelect";
import ShowCountryNamesToggle from "./ShowCountryNamesToggle";

const Control = () => {
  return (
    <div className="grid grid-cols-[2fr_3fr] items-center gap-5 justify-between text-sm">
      <ShowCountryNamesToggle />
      <ContinentsSelect />
    </div>
  );
};

export default Control;
