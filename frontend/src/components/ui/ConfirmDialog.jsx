import { AlertTriangle, Check, Trash2, X } from "lucide-react";
import Button from "./Button";
import Modal from "./Modal";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  icon,
  loading = false,
}) => {
  const variants = {
    destructive: {
      icon: Trash2,
      confirmVariant: "destructive",
      iconColor: "text-error",
      bgColor: "bg-error/10",
    },
    warning: {
      icon: AlertTriangle,
      confirmVariant: "warning",
      iconColor: "text-warning",
      bgColor: "bg-warning/10",
    },
    primary: {
      icon: Check,
      confirmVariant: "primary",
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
  };

  const config = variants[variant];
  const IconComponent = icon || config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            icon={<X />}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={onConfirm}
            loading={loading}
            icon={<IconComponent />}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-full ${config.bgColor}`}>
          <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-foreground">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
