import { Minus, Plus } from "lucide-react";
import { cn } from "../../utils/cn";

const QuantityInput = ({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  className,
  size = "md",
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || min;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const sizes = {
    sm: {
      container: "h-8",
      button: "w-8 h-8",
      input: "w-12 text-sm",
      icon: 14,
    },
    md: {
      container: "h-10",
      button: "w-10 h-10",
      input: "w-16 text-base",
      icon: 16,
    },
    lg: {
      container: "h-12",
      button: "w-12 h-12",
      input: "w-20 text-lg",
      icon: 18,
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div
      className={cn(
        "flex items-center border border-gray-200 rounded-lg",
        sizeConfig.container,
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className={cn(
          "flex items-center justify-center border-r border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg",
          sizeConfig.button
        )}
      >
        <Minus size={sizeConfig.icon} />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        className={cn(
          "text-center border-none outline-none focus:ring-0 bg-transparent font-medium text-gray-900",
          sizeConfig.input
        )}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className={cn(
          "flex items-center justify-center border-l border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg",
          sizeConfig.button
        )}
      >
        <Plus size={sizeConfig.icon} />
      </button>
    </div>
  );
};

export default QuantityInput;
