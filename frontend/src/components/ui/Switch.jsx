const Switch = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "w-8 h-4",
    md: "w-11 h-6",
    lg: "w-14 h-8",
  };

  const thumbSizes = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex items-center rounded-full transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${checked ? "bg-primary" : "bg-muted"}
        ${sizes[size]} ${className}
      `}
    >
      <span
        className={`
          inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200
          ${checked ? "translate-x-5" : "translate-x-0.5"}
          ${thumbSizes[size]}
        `}
      />
    </button>
  );
};

export default Switch;
