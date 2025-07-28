import { CreditCard, Trash2 } from "lucide-react";
import { useState } from "react";
import useStore from "../../../store";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";
import Table from "../../ui/Table";
import PaymentModal from "./PaymentModal";

const OrderTable = ({ orders, onUpdatePayment, onDelete }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const isAdmin = useStore((state) => state.isAdmin());

  const handlePaymentClick = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    await onDelete(orderId);
  };

  const columns = [
    {
      key: "id",
      header: "Order ID",
      width: "100px",
      render: (value) => `#${value}`,
    },
    {
      key: "tableId",
      header: "Table",
      width: "80px",
    },
    {
      key: "items",
      header: "Items",
      render: (items) => (
        <div className="max-w-xs truncate">
          {items
            ?.map((item) => `${item.menuItemId} x${item.quantity}`)
            .join(", ") || "No items"}
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      width: "100px",
      render: (_, order) => {
        const total =
          order.items?.reduce(
            (sum, item) => sum + (item.price || 0) * item.quantity,
            0
          ) || 0;
        return <span className="font-semibold">{formatCurrency(total)}</span>;
      },
    },
    {
      key: "status",
      header: "Status",
      width: "120px",
      render: (status) => (
        <Badge
          variant={
            status === "completed"
              ? "success"
              : status === "ready"
              ? "primary"
              : status === "in_progress"
              ? "warning"
              : "error"
          }
          size="sm"
        >
          {status?.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "payment",
      header: "Payment",
      width: "150px",
      render: (_, order) => (
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
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      width: "150px",
      render: (date) => (date ? formatDateTime(date) : "-"),
    },
  ];

  if (isAdmin) {
    columns.push({
      key: "actions",
      header: "Actions",
      width: "120px",
      render: (_, order) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePaymentClick(order)}
            className="p-2"
          >
            <CreditCard className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(order.id)}
            className="p-2 text-error hover:bg-error/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    });
  }

  return (
    <>
      <Table columns={columns} data={orders} emptyMessage="No orders found" />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        order={selectedOrder}
        onUpdate={onUpdatePayment}
      />
    </>
  );
};

export default OrderTable;
