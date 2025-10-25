interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleButton = ({ checked, onChange, disabled }: Props) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex items-center h-6 w-11 rounded-full 
        transition-colors duration-300 ease-in-out
        ${checked ? "bg-green-500" : "bg-neutral-600"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      aria-pressed={checked}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white shadow 
          transition-transform duration-300 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-1"}
        `}
      />
    </button>
  );
};

export default ToggleButton;
