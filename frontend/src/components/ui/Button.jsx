import { Loader2 } from "lucide-react";
import React from "react";
import { cn } from "../../utils/cn";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  icon,
  iconPosition = "left",
  fullWidth = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-target";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 focus:ring-primary/50 shadow-md hover:-translate-y-0.5",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary/50 shadow-md hover:shadow-lg",
    outline:
      "border-2 border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground focus:ring-primary/50 hover:shadow-md",
    ghost:
      "text-primary hover:bg-primary/10 focus:ring-primary/50 hover:shadow-sm",
    destructive:
      "bg-error text-error-foreground hover:bg-error/90 focus:ring-error/50 shadow-md hover:shadow-lg",
    success:
      "bg-success text-success-foreground hover:bg-success/90 focus:ring-success/50 shadow-md hover:shadow-lg",
    warning:
      "bg-warning text-warning-foreground hover:bg-warning/90 focus:ring-warning/50 shadow-md hover:shadow-lg",
  };

  const sizes = {
    xs: "px-2 py-1 text-xs h-7 gap-1",
    sm: "px-3 py-2 text-sm h-9 gap-2",
    md: "px-4 py-3 text-base h-12 gap-2",
    lg: "px-6 py-4 text-lg h-14 gap-3",
    xl: "px-8 py-5 text-xl h-16 gap-3",
  };

  const iconSizes = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6",
  };

  const renderIcon = (iconElement, position) => {
    if (!iconElement) return null;

    return React.cloneElement(iconElement, {
      className: cn(iconSizes[size], iconElement.props.className),
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className={cn("animate-spin", iconSizes[size])} />
          <span>{typeof children === "string" ? "Loading..." : children}</span>
        </>
      );
    }

    if (icon && iconPosition === "left") {
      return (
        <>
          {renderIcon(icon, "left")}
          {children && <span>{children}</span>}
        </>
      );
    }

    if (icon && iconPosition === "right") {
      return (
        <>
          {children && <span>{children}</span>}
          {renderIcon(icon, "right")}
        </>
      );
    }

    if (icon && !children) {
      return renderIcon(icon, "only");
    }

    return children;
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        (loading || disabled) && "cursor-not-allowed active:scale-100",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

// Button group component for related actions
export const ButtonGroup = ({
  children,
  className,
  orientation = "horizontal",
}) => {
  return (
    <div
      className={cn(
        "inline-flex",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        "[&>button]:rounded-none [&>button:first-child]:rounded-l-xl [&>button:last-child]:rounded-r-xl",
        orientation === "vertical" &&
          "[&>button:first-child]:rounded-t-xl [&>button:first-child]:rounded-l-xl [&>button:last-child]:rounded-b-xl [&>button:last-child]:rounded-l-xl",
        "[&>button:not(:last-child)]:border-r-0",
        orientation === "vertical" &&
          "[&>button:not(:last-child)]:border-r [&>button:not(:last-child)]:border-b-0",
        className
      )}
    >
      {children}
    </div>
  );
};

// Icon button component for icon-only buttons
export const IconButton = ({ icon, size = "md", tooltip, ...props }) => {
  const button = (
    <Button
      size={size}
      icon={icon}
      className={cn("aspect-square", props.className)}
      {...props}
    />
  );

  if (tooltip) {
    return (
      <div className="relative group">
        {button}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {tooltip}
        </div>
      </div>
    );
  }

  return button;
};

export default Button;
