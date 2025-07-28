import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";
import Button from "./Button";

const Alert = ({
  type = "info",
  message,
  className,
  dismissible = false,
  autoHide = false,
  autoHideDelay = 5000,
  onDismiss,
  actions,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const styles = {
    error: {
      container: "bg-error-50 border border-error-200 text-error-800",
      icon: XCircle,
      iconColor: "text-error-500",
    },
    success: {
      container: "bg-success-50 border border-success-200 text-success-800",
      icon: CheckCircle,
      iconColor: "text-success-500",
    },
    warning: {
      container: "bg-warning-50 border border-warning-200 text-warning-800",
      icon: AlertCircle,
      iconColor: "text-warning-500",
    },
    info: {
      container: "bg-primary-50 border border-primary-200 text-primary-800",
      icon: Info,
      iconColor: "text-primary-500",
    },
  };

  const { container, icon: Icon, iconColor } = styles[type];

  return (
    <div
      className={cn(
        "flex items-start p-4 rounded-xl animate-fade-in",
        container,
        className
      )}
    >
      <Icon className={cn("h-5 w-5 mr-3 flex-shrink-0 mt-0.5", iconColor)} />

      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium block">{message}</span>

        {actions && (
          <div className="flex gap-2 mt-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                size="xs"
                variant={action.variant || "outline"}
                onClick={action.onClick}
                className="text-xs"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          onClick={handleDismiss}
          className="ml-2 p-1 hover:bg-black/10 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
