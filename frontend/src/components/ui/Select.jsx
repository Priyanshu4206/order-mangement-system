import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  className = "",
  disabled = false,
  error = false,
  clearable = false,
  searchable = false,
  multiple = false,
  size = "md",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get selected option(s) for display
  const getSelectedOption = () => {
    if (multiple) {
      return options.filter((option) => value?.includes(option.value));
    }
    return options.find((option) => option.value === value);
  };

  const selectedOption = getSelectedOption();

  // Handle option selection
  const handleOptionSelect = (optionValue) => {
    if (multiple) {
      const newValue = value?.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...(value || []), optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  // Handle clear selection
  const handleClear = (e) => {
    e.stopPropagation();
    onChange(multiple ? [] : "");
  };

  // Render selected value display
  const renderSelectedValue = () => {
    if (multiple && selectedOption?.length > 0) {
      if (selectedOption.length === 1) {
        return selectedOption[0].label;
      }
      return `${selectedOption.length} items selected`;
    }

    if (!multiple && selectedOption) {
      return selectedOption.label;
    }

    return placeholder;
  };

  const hasValue = multiple ? value?.length > 0 : value;

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Select Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full rounded-xl border-2 transition-all duration-200 text-left
          bg-input text-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:border-primary/50
          ${error ? "border-error" : "border-border"}
          ${isOpen ? "border-primary ring-2 ring-primary/20" : ""}
          ${sizes[size]}
        `}
      >
        <div className="flex items-center justify-between">
          <span
            className={`truncate ${!hasValue ? "text-muted-foreground" : ""}`}
          >
            {renderSelectedValue()}
          </span>

          <div className="flex items-center gap-2 ml-2">
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-border">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                {searchable && searchTerm
                  ? "No options found"
                  : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = multiple
                  ? value?.includes(option.value)
                  : value === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionSelect(option.value)}
                    className={`
                      w-full px-4 py-3 text-left text-sm transition-colors
                      hover:bg-muted/50 focus:bg-muted/50 focus:outline-none
                      ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "text-foreground"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{option.label}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Selected Items Display for Multiple Selection */}
      {multiple && selectedOption?.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedOption.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
            >
              {option.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionSelect(option.value);
                }}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
