import { Save, X } from "lucide-react";
import { useState } from "react";
import { PAYMENT_METHODS, PAYMENT_STATUS } from "../../../utils/constants";
import Alert from "../../ui/Alert";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Select from "../../ui/Select";

const PaymentModal = ({ isOpen, onClose, order, onUpdate }) => {
  const [paymentStatus, setPaymentStatus] = useState(
    order?.paymentStatus || "pending"
  );
  const [paymentMethod, setPaymentMethod] = useState(
    order?.paymentMethod || ""
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleUpdate = async () => {
    // Validation
    if (paymentStatus === "paid" && !paymentMethod) {
      setAlert({
        type: "warning",
        message: "Please select a payment method for paid orders",
      });
      return;
    }

    setIsUpdating(true);
    setAlert(null);

    const result = await onUpdate(order.id, paymentStatus, paymentMethod);

    if (result.success) {
      setAlert({
        type: "success",
        message: "Payment updated successfully",
      });
      // Close modal after showing success message
      setTimeout(() => {
        onClose();
        setAlert(null);
      }, 1500);
    } else {
      setAlert({
        type: "error",
        message: result.error || "Failed to update payment",
      });
    }
    setIsUpdating(false);
  };

  const handleClose = () => {
    setAlert(null);
    onClose();
  };

  const paymentStatusOptions = [
    { value: PAYMENT_STATUS.PENDING, label: "Pending" },
    { value: PAYMENT_STATUS.PAID, label: "Paid" },
  ];

  const paymentMethodOptions = [
    { value: PAYMENT_METHODS.CASH, label: "Cash" },
    { value: PAYMENT_METHODS.CARD, label: "Card" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Update Payment - Order #${order?.id}`}
      footer={
        <>
          <Button
            variant="outline"
            onClick={handleClose}
            icon={<X />}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            loading={isUpdating}
            icon={<Save />}
          >
            {isUpdating ? "Updating..." : "Update Payment"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Alert Display */}
        {alert && (
          <Alert type={alert.type} message={alert.message} className="mb-4" />
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Payment Status
          </label>
          <Select
            options={paymentStatusOptions}
            value={paymentStatus}
            onChange={setPaymentStatus}
            disabled={isUpdating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Payment Method
            {paymentStatus === "paid" && (
              <span className="text-error ml-1">*</span>
            )}
          </label>
          <Select
            options={paymentMethodOptions}
            value={paymentMethod}
            onChange={setPaymentMethod}
            placeholder="Select payment method"
            disabled={isUpdating}
          />
          {paymentStatus === "paid" && !paymentMethod && (
            <p className="text-xs text-muted-foreground mt-1">
              Payment method is required for paid orders
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-muted/30 rounded-lg p-3 mt-4">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Order Summary
          </h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span>#{order?.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Table:</span>
              <span>{order?.tableId}</span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span>{order?.items?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
