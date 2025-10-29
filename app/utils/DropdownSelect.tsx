import { ChangeEvent } from "react";

interface Props {
  label: string;
  value: string;
  defaultValue?: string;
  options: string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const DropdownSelect = ({
  label,
  value,
  defaultValue = "— Chọn —",
  options,
  onChange,
}: Props) => {
  return (
    <>
      <label htmlFor="select" className="block mb-2 font-medium">
        {label}
      </label>

      <select
        id="select"
        value={value}
        onChange={onChange}
        className="block p-2 rounded-t-md shadow-md bg-neutral-600 max-w-32 h-auto focus:ring-0 focus:outline-none"
      >
        <option value="">{defaultValue}</option>

        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
};
