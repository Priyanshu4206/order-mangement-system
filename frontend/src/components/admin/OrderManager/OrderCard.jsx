import { CreditCard, Trash2 } from "lucide-react";
import { useState } from "react";
import useStore from "../../../store";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";
import { useConfirm } from "../../../hooks/useConfirm";
import Alert from "../../ui/Alert";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import ConfirmDialog from "../../ui/ConfirmDialog";
import PaymentModal from "./PaymentModal";

const OrderCard = ({ order, onUpdatePayment, onDelete }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alert, setAlert] = useState(null);
  const { confirmState, confirm, cancel } = useConfirm();
  const isAdmin = useStore((state) => state.isAdmin());

  const handleDelete = async () => {
    await confirm({
      title: "Delete Order",
      message: `Are you sure you want to delete Order #${order.id}? This action cannot be undone.`,
      variant: "destructive",
      onConfirm: async () => {
        setIsDeleting(true);

        try {
          const result = await onDelete(order.id);

          if (!result.success) {
            setAlert({
              type: "error",
              message: result.error || "Failed to delete order",
            });
            setTimeout(() => setAlert(null), 5000);
          } else {
            setAlert({
              type: "success",
              message: "Order deleted successfully",
            });
            setTimeout(() => setAlert(null), 3000);
          }
        } catch (error) {
          setAlert({
            type: "error",
            message: "An unexpected error occurred",
          });
          setTimeout(() => setAlert(null), 5000);
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  const totalAmount =
    order.items?.reduce(
      (sum, item) => sum + (item.price || 0) * item.quantity,
      0
    ) || 0;

  return (
    <>
      {/* Alert Display */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert
            type={alert.type}
            message={alert.message}
            className="shadow-lg"
            dismissible
            onDismiss={() => setAlert(null)}
          />
        </div>
      )}

      <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground">Order #{order.id}</h3>
            <p className="text-sm text-muted-foreground">
              Table {order.tableId}
            </p>
          </div>
          <Badge
            variant={
              order.status === "completed"
                ? "success"
                : order.status === "ready"
                ? "primary"
                : order.status === "in_progress"
                ? "warning"
                : "error"
            }
          >
            {order.status?.replace("_", " ")}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Items: </span>
            <span className="text-foreground">
              {order.items
                ?.map((item) => `${item.menuItemId} x${item.quantity}`)
                .join(", ") || "No items"}
            </span>
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Total: </span>
            <span className="font-semibold text-foreground">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={order.paymentStatus === "paid" ? "success" : "error"}
              size="sm"
            >
              {order.paymentStatus || "pending"}
            </Badge>
            {order.paymentMethod && (
              <Badge variant="secondary" size="sm">
                {order.paymentMethod}
              </Badge>
            )}
          </div>

          {order.createdAt && (
            <p className="text-xs text-muted-foreground">
              {formatDateTime(order.createdAt)}
            </p>
          )}
        </div>

        {isAdmin && (
          <div className="flex gap-2 pt-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPaymentModal(true)}
              className="flex-1"
              icon={<CreditCard />}
            >
              Payment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-error hover:bg-error/10"
              icon={<Trash2 />}
            />
          </div>
        )}
      </Card>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        order={order}
        onUpdate={onUpdatePayment}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={cancel}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        variant={confirmState.variant}
        loading={isDeleting}
      />
    </>
  );
};

export default OrderCard;
