import { useState } from "react";

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    variant: "destructive",
  });

  const confirm = ({ title, message, onConfirm, variant = "destructive" }) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        variant,
        onConfirm: async () => {
          try {
            await onConfirm?.();
            resolve(true);
          } catch (error) {
            resolve(false);
          } finally {
            setConfirmState((prev) => ({ ...prev, isOpen: false }));
          }
        },
      });
    });
  };

  const cancel = () => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    confirmState,
    confirm,
    cancel,
  };
};
